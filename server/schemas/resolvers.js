const { User, Post, Comment, Like } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express'); // Make sure to import this.
const AWS = require('aws-sdk'); // Required for direct S3 operations
const { v4: uuidv4 } = require('uuid');  // for generating unique filenames
// Use the already set-up s3 instance from your s3.js file
const { GraphQLUpload } = require('graphql-upload');
const moderateText = require('../utils/ai/moderateText');
const checkForJackieChan = require('../utils/ai/moderateImage');
const isItJackieChan = require('../utils/ai/isItJackieChan');
const generateFeed = require('../algorithms/feed_generator');



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

const extractHashtags = (text) => {
  const regex = /#(\w+)/g;
  const result = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    result.push(match[1]);
  }
  return result;
};


const resolvers = {
  Query: {
    // WORKS FOR NOW ISH
    userFeed: async (_, { userId }, context) => {
      if (!context.user) {
        throw new Error('Authentication required!');
      }
      let feed = await generateFeed(userId);


      return feed || [];
    },
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const userData = await User.findOne({ _id: context.user._id })
        .select('-__v -password')
        .populate('posts')
        .populate('comments');
      return userData || null; // Handle potential null values
    },
    users: async () => {
      const usersList = await User.find()
        .select('-__v -password')
        .populate('posts')
        .populate('comments');
      return usersList || []; // Ensure we return an empty array if there are no users
    },
    user: async (parent, { username }) => {
      const user = await User.findOne({ username })
        .select('-__v -password')
        .populate('posts')
        .populate('comments');
      if (!user) {
        throw new Error(`User with username ${username} not found!`);
      }
      return user;
    },
    post: async (parent, { _id }) => {
      const post = await Post.findById(_id)
        .populate({
          path: 'likes',
          match: { createdAt: { $exists: true } }
        })
        .populate('likes.user')
        .populate('user')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            model: 'User'
          }
        });

      if (!post) {
        throw new Error(`Post with ID ${_id} not found!`);
      }

      // Ensure each like and comment has necessary fields
      post.likes = post.likes.filter(like => like.createdAt);
      post.comments = post.comments.filter(comment => comment.content && comment.user);

      return post;
    },
    posts: async (parent, { username }) => {
      let query = {};

      if (username) {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error(`User with username ${username} not found!`);
        }
        query = { user: user._id };
      }

      const postsList = await Post.find(query)
        .populate({
          path: 'likes',
          match: { createdAt: { $exists: true } }  // Only populate likes that have a createdAt
        })
        .populate({ path: 'likes.user' })
        .populate({ path: 'user' })
        .populate({ path: 'comments' })  // Populating comments
        .populate({ path: 'comments.user' });  // Populating user of each comment

      return postsList || []; // Ensure we return an empty array if there are no posts
    },
    comments: async (parent, { username }) => {
      try {
        // Find comments by the given username
        const userComments = await Comment.find({ username: username });

        console.log("userComments:", userComments);

        return userComments || [];
      } catch (error) {
        throw new Error(`Failed to fetch comments for username: ${username}. Error: ${error.message}`);
      }


      // const { createReadStream, filename } = await avatar;
      // const fileStream = createReadStream();
      // const uniqueFilename = uuidv4() + '-' + filename; // Generate a unique name


    },


    likes: async (_, { username }) => {
    
      try {
        // Fetch the user first
        const user = await User.findOne({ username: username });
     
        
        if (!user) {
          throw new Error(`User not found with username: ${username}`);
        }
    
        // Find likes by the user's ID
        const userLikes = await Like.find({ user: user._id }).populate('post').populate('user');
        
        return userLikes || [];
      } catch (error) {
        throw new Error(`Failed to fetch likes for username: ${username}. Error: ${error.message}`);
      }
    },
    like: async (_, { postId }, context) => {

      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to like a post');
      }
    
      // Check if the user has already liked this post
      const existingLike = await Like.findOne({ post: postId, user: context.user._id });
    
      if (existingLike) {
        throw new Error('You have already liked this post');
      }
    
      // Create a new like
      const newLike = new Like({
        post: postId,
        user: context.user._id,
      });
    
      await newLike.save();
    
      return newLike;  // If needed, otherwise you can return a simple message or the updated post
    },
    
  },
  Upload: GraphQLUpload,
  Mutation: {



    // WORKS FOR NOW DONT TOUCH

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
        const hashtags = extractHashtags(content);
        console.log("hashtags:", hashtags);

        // const aboutJackieChan = await isItJackieChan(content);
        // if (aboutJackieChan) {
        //   throw new Error('Jackie Chan is not allowed in posts.');
        //   return itIsJackieChan;
        // }

        // const isJackieChan = await checkForJackieChan(photo);
        // if (isJackieChan) {
        //   throw new Error('Jackie Chan is not allowed in photos.');
        //   return;
        // }
        const moderatedContent = await moderateText(content);

        if (moderatedContent === "0") {
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

        console.log("context.user:", context.user._id);

        const post = await Post.create({
          content,
          photo: photoUrl,
          user: context.user._id,
          hashtags // `hashtags: hashtags`
        });

     

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { posts: post._id } },
          { new: true }
        );
        console.log("User updated");
        return post;
      }

    },
    checkImage: async (_, { file }) => {
      const { createReadStream } = await file;
      const chunks = [];
      for await (let chunk of createReadStream()) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      return await checkForJackieChan(buffer);

    },





    likePost: async (_, { postId }, context) => {
      if (!context.user) {
          throw new AuthenticationError('You need to be logged in to like a post');
      }
      

      const alreadyLiked = await Like.findOne({ post: postId, user: context.user._id });
  
      if (alreadyLiked) {
          console.warn('User has already liked this post'); // Logging for debugging purposes.
          const post = await Post.findById(postId);
          return post; // Return the post without changes.
      }
      
      const newLike = new Like({ post: postId, user: context.user._id });

    
  
      await newLike.save();

    
  
      // Here, limit the populated fields to only what's necessary.
      const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { $addToSet: { likes: newLike._id } },
          { new: true }
      )
      .populate('likes')
      .populate({ path: 'likes.user' })  // If you need user details for each like.
      .populate({ path: 'user' });       // If you need user details of the post owner.
      
     
  
      if (updatedPost && updatedPost.hashtags && updatedPost.hashtags.length) {
          await User.findByIdAndUpdate(
              context.user._id,
              { $addToSet: { interests: { $each: updatedPost.hashtags } } },
              { new: true }
          );
      }
  
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

    const updatedPost = await Post.findById(postId);

    if (!updatedPost) {
      throw new Error('Post not found');
    }

    // Remove the post's hashtags from the user's interests
    await User.findByIdAndUpdate(
      context.user._id,
      { $pullAll: { interests: updatedPost.hashtags } },
      { new: true }
    );

    // Update the likes on the post
    await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: like._id } },
      { new: true }
    )
      .populate('likes')
      .populate({ path: 'likes.user' }); // <-- populate the user for each like

    return updatedPost;
  },






    addComment: async (_, { postId, content }, context) => {
    if (!context.user) {
        throw new AuthenticationError('You need to be logged in to comment on a post');
    }

    const newComment = new Comment({
        content: content,
        post: postId,
        user: context.user._id
    });

    try {
        await newComment.save();

        const postWithComments = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: newComment._id } },
            { 
                new: true,
                populate: {
                    path: 'comments',
                    model: 'Comment',
                    populate: {
                        path: 'user',
                        model: 'User'
                    }
                }
            }
        );

        if (!postWithComments) {
            throw new Error('Post not found');
        }

        return postWithComments;

    } catch (error) {
        console.error('Error saving the comment:', error);
        throw new Error('There was an issue adding the comment. Please try again later.');
    }
},

deleteComment: async (_, { postId, commentId }, context) => {
    // You can use Promise.all to fetch comment and post concurrently
    const [comment, post] = await Promise.all([
        Comment.findById(commentId),
        Post.findById(postId)
    ]);

    if (!comment) {
        throw new Error('Comment not found');
    }
    if (!post) {
        throw new Error('Post not found');
    }

    const currentUserId = context.user._id.toString();
    const postUserId = post.user.toString();
    const commentUserId = comment.user.toString();

    if (commentUserId !== currentUserId && postUserId !== currentUserId) {
        throw new AuthenticationError('You can only delete comments that you posted or on your own posts.');
    }

    await Comment.findByIdAndDelete(commentId);

    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { comments: commentId } },
        { 
            new: true,
            populate: {
                path: 'comments',
                model: 'Comment',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            }
        }
    );

    return updatedPost;
},


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