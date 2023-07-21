const { User, Post, Comment, Like } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const personalizedFeed = require('../algorithms/feed_generator');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const GraphQLUpload = require('graphql-upload');

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
      return await personalizedFeed(context.user._id);
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
        .populate('comments');
    },
    post: async (parent, { _id }) => {
      return Post.findOne({ _id }).populate('likes').populate({ path: 'user' });

    },
    posts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Post.find(params).sort({ createdAt: -1 }).populate('likes').populate({ path: 'user' });
    },
  },
  Upload: GraphQLUpload,
  Mutation: {
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
      console.log("content:", content);
      console.log("context:", context.user);

      if (context.user) {

        console.log("User is logged in. Adding post...");

        let photoUrl;

        // handle moderation take text and send to openai api to get if it passes or not



        // Handle the photo upload if it exists
        if (photo) {

          const { createReadStream, filename } = await photo.file;
          const fileStream = createReadStream();
          const uniqueFilename = uuidv4() + "-" + filename;  // generate a unique name

          try {
            photoUrl = await uploadToS3(fileStream, uniqueFilename);
          } catch (error) {
            console.error("Error uploading to S3:", error);
            throw new Error('Error uploading image to S3.');
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
      }

      throw new AuthenticationError('You need to be logged in!');
    },

    likePost: async (_, { postId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to like a post');
      }

      const alreadyLiked = await Like.findOne({ post: postId, userId: context.user._id });
      if (alreadyLiked) {
        throw new Error('You already liked this post');
      }

      const newLike = new Like({ post: postId, userId: context.user._id });
      await newLike.save();

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: newLike._id } },
        { new: true }
    )
    .populate('likes')
    .populate({ path: 'user'});
    
      

      return updatedPost;
    },
    unlikePost: async (_, { postId }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in to unlike a post');
      }

      const like = await Like.findOneAndDelete({ post: postId, userId: context.user._id });
      if (!like) {
        throw new Error('You haven\'t liked this post yet');
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: like._id } },
        { new: true }
      ).populate('likes');

      return updatedPost;
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