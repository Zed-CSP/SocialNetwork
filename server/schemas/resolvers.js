// resolvers.js

const { User, Post, Comment, Like } = require('../models');
const { signToken } = require('../utils/auth');

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
        .populate('voice')
        .populate('currency');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('posts')
        .populate('comments')
        .populate('likes')
        .populate('voice')
        .populate('currency');
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
    addUser: async (parent, args) => {
      console.log(args, "args");
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      console.log(email, password, "email, password")
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      console.log("User success for log in almost just token to go");
      
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    addpost: async (parent, { postContent }, context) => {
      if (context.user) {
        const gptResponse = await openai.Completion.create({
          engine: "text-davinci-003",
          prompt: `Please respond with only a 1 or a 0 to wether or not this content is against our standards. let a 1 response be approved and a 0 response be failed. Our standards are that the following content cannot be mean, gross, racist, violent, or related to the actor Jackie Chan or his movies: ${postContent}`,
          max_tokens: 1,
        });
      const approvalStatus = parseInt(gptResponse.choices[0].text.trim());
  
        if (approvalStatus === 1) {
          const post = await Post.create({ content: postContent, username: context.user.username });
  
          await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { posts: post._id } },
            { new: true }
          );
  
          return { message: "Post approved and added", post };
        } else {
          await User.updateOne(
            { _id: context.user._id },
            { $inc: { naughtyCount: 1 } },
          );
          throw new Error('Post not approved');
        }
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
