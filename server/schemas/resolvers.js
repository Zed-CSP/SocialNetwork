const { User, Post, Comment, Like } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express'); // Make sure to import this.
const personalizedFeed = require('../algorithms/feed_generator'); // Import the feed generator
const AWS = require('aws-sdk'); // Required for direct S3 operations
const { v4: uuidv4 } = require('uuid');  // for generating unique filenames
// Use the already set-up s3 instance from your s3.js file
const { GraphQLUpload } = require('graphql-upload');
const moderateText = require('../utils/ai/moderateText');


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadToS3 = async (fileStream, filename) => {
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: filename,
    Body: fileStream
  };

  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, (error, data) => {
      if (error) {
        reject(new Error('Error uploading image.'));
      }
      resolve(data.Location);
    });
  });
};

const resolvers = {
  Query: {
    userFeed: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required!');
      }
      return Post.find().populate('likes').populate({ path: 'likes.user' }).populate({ path: 'user' });

    },
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('posts')
          .populate('comments');
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('posts')
        .populate('comments');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('posts')
        .populate('comments')
    },
    post: async (parent, { _id }) => {
      return Post.findById(_id).populate('likes').populate({ path: 'likes.user' }).populate({ path: 'user' });


    },
    posts: async (parent, { username }) => {
      let query = {};

      if (username) {
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found!');
        query = { user: user._id };
      }

      return Post.find(query)
        .populate('likes')
        .populate({ path: 'likes.user' })
        .populate({ path: 'user' })
        .populate({ path: 'comments' })  // Populating comments
        .populate({ path: 'comments.user' });  // Populating user of each comment
    },


  },
  Upload: GraphQLUpload,
  Mutation: {

    uploadAvatar: async (_, { avatar }, user) => {
      // Check if the user is authenticated
      if (!user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      if (!avatar) {
        throw new Error('Please provide an image file.');
      }

      const { createReadStream, filename } = await avatar.file;
      const fileStream = createReadStream();
      const uniqueFilename = uuidv4() + '-' + filename; // Generate a unique name

      try {
        const avatarUrl = await uploadToS3(fileStream, uniqueFilename);
        // Update the user's profile_picture field with the new URL
        await User.findByIdAndUpdate(user._id, { profile_picture: avatarUrl });
        return true;
      } catch (error) {
        console.error('Error uploading avatar:', error);
        throw new Error('Error uploading avatar.');
      }


    },

    addUser: async (parent, { username, email, password, date_of_birth }) => {
      const user = await User.create({ username, email, password, date_of_birth });
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {

      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addPost: async (_, { content, photo }, context) => {
      console.log("addPost resolver");
      

      let photoUrl;
      if (context.user) {
        console.log(content);

        const moderatedContent = await moderateText(content);
        
        if(moderatedContent === "0") {
          throw new Error('Your post contains inappropriate content.');
          return;
        }

        console.log("Moderated content:", moderatedContent);



        // Handle the photo upload if it exists
        if (photo) {
          const photoDetails = await photo;
          console.log("photoDetails:", photoDetails);

          // Check if createReadStream exists in photoDetails, and if it's a function
          if (typeof photoDetails.createReadStream !== "function") {
            console.error("createReadStream is not a function on photoDetails!");
            throw new Error('createReadStream is not available on the photo object.');
          }

          const fileStream = photoDetails.createReadStream();
          const uniqueFilename = uuidv4() + "-" + photoDetails.filename;

          try {
            photoUrl = await uploadToS3(fileStream, uniqueFilename);
          } catch (error) {
            console.error("Error uploading to S3:", error);
            throw new Error('Error uploading image to S3.');
          }
        }
      }
      const post = await Post.create({ content, photo: photoUrl, userId: context.user._id });
      console.log("Post created:", post);

      await User.findByIdAndUpdate(
        { _id: context.user._id },
        { $push: { posts: post._id } },
        { new: true }
      );

      return post;
    },

    likePost: async (_, { postId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to like a post');
      }

      const alreadyLiked = await Like.findOne({ post: postId, user: context.user._id });

      if (alreadyLiked) {
        throw new Error('You already liked this post');
      }

      const newLike = new Like({ post: postId, user: context.user._id });

      await newLike.save();

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: newLike._id } },
        { new: true }
      )
        .populate('likes')
        .populate({ path: 'likes.user' })  // <-- this will populate the user for each like
        .populate({ path: 'user' }); // this populates the user of the post itself


      return updatedPost;
    },
    unlikePost: async (_, { postId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to unlike a post');
      }

      const like = await Like.findOneAndDelete({ post: postId, user: context.user._id });
      if (!like) {
        throw new Error('You haven\'t liked this post yet');
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: like._id } },
        { new: true }
      )
        .populate('likes')
        .populate({ path: 'likes.user' }); // <-- populate the user for each like



      return updatedPost;
    },






    addComment: async (_, { postId, content }, context) => {
      console.log("addComment resolver");
      console.log("postId:", postId);
      console.log("content:", content);

      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to comment on a post');
      }

      console.log("context:", context.user);

      // Optionally, you can add text moderation here if necessary

      const newComment = new Comment({
        content: content,
        post: postId,
        user: context.user._id

      });

      console.log("newComment:", newComment);

      try {
        await newComment.save();
        console.log("Saved comment:", newComment);


        // Updating the Post model to have an array of comments and pushing the new comment ID to it.
        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $push: { comments: newComment._id } },
          { new: true }
        );

        if (!updatedPost) {
          throw new Error('Post not found');
        }

        const postWithComments = await Post.findById(postId)
          .populate({
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'user',
              model: 'User'
            }
          });

        console.log("postWithComments:", JSON.stringify(postWithComments, null, 2));


        return postWithComments;

      } catch (error) {
        console.error('Error saving the comment:', error);
        throw new Error('There was an issue adding the comment. Please try again later.');
      }
    },








    deletePost: async (parent, { postId }, context) => {
      if (context.user) {
        const post = await Post.findByIdAndDelete({ _id: postId });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { posts: post._id } },
          { new: true }
        );

        return post;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;