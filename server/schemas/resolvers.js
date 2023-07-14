const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-errors');

// Set up the resolver functions for the types defined in the typeDefs.js file.
const resolvers = {
    Query: {
        // Me returns a User type, which is defined in typeDefs.js
        me: async (parent, args, context) => {
            console.log('Route hit', context);
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks');



                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },
    },

    Mutation: {
        // Set up mutations to handle creating a user, logging a user in, saving a book, and removing a book.
        addUser: async (parent, args) => {
            // user grabs the args from the mutation
            const user = await User.create(args);
            const token = signToken(user);

            // return an object that contains the token and a user object
            return { token, user };
        },

        login: async (parent, { email, password }) => {
            // user grabs the args from the mutation
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // check if the password is correct
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            // return an object that contains the token and a user object
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, bookData, context) => {
           // if user is logged in and valid
            if (context.user) {
                
                // updatedUser grabs the args from the mutation
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                );
                // return the updated user
                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        // removeBook takes in a bookId as an argument
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                // updatedUser grabs the args from the mutation
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
    },
};

module.exports = resolvers;
