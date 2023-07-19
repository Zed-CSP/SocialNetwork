const { User, Post, Comment, Like } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express'); // Make sure to import this.
const upload = require('../config/s3');
const AWS = require('aws-sdk'); // Required for direct S3 operations

// Use the already set-up s3 instance from your s3.js file
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
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('posts')
          .populate('comments')
          .populate('likes')
          .populate('voice')
          .populate('currency');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('posts')
        .populate('comments')
        .populate('likes')
        .populate('voice');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('posts')
        .populate('comments')
        .populate('likes')
        .populate('voice');
    },
    posts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Post.find(params).sort({ createdAt: -1 });
    },
    post: async (parent, { _id }) => {
      return Post.findOne({ _id });
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      console.log(email, password, "email, password")
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      console.log(token, "token", user, "user");
      return { token, user };
    },
    addPost: async (parent, { content, photo }, context) => {
      console.log("addPost");
      if (context.user) {

          let photoUrl;

          // Handle the photo upload if it exists
          if (photo) {
              const { createReadStream, filename } = await photo;
              const fileStream = createReadStream();

              try {
                  photoUrl = await uploadToS3(fileStream, filename);
              } catch (error) {
                  throw new Error('Error uploading image to S3.');
              }
          }

          const post = await Post.create({ content, photoUrl, username: context.user.username });

          await User.findByIdAndUpdate(
              { _id: context.user._id },
              { $push: { posts: post._id } },
              { new: true }
          );

          return post;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    addLike: async (parent, { postId }, context) => {
      if (context.user) {
        const like = await Like.create({ username: context.user.username });

        await Post.findByIdAndUpdate(
          { _id: postId },
          { $push: { likes: like._id } },
          { new: true }
        );

        return like;
      }

      throw new AuthenticationError('You need to be logged in!');
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