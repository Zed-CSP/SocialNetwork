// typeDefs.js

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    date_of_birth: String
    password: String
    profile_picture: String
    posts: [Post]
    voice: Int
    currency: Int
  }

  type Post {
    _id: ID
    content: String
    createdAt: String
    username: String
    comments: [Comment]
    likes: [Like]
    volume: Int
  }

  type Comment {
    _id: ID
    content: String
    createdAt: String
    username: String
  }

  type Like {
    _id: ID
    username: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    posts: [Post]
    post(_id: ID!): Post
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, date_of_birth: String!, password: String!): Auth
    addPost(content: String!): Post
    addComment(postId: ID!, content: String!): Post
    addLike(postId: ID!): Post
    deletePost(postId: ID!): User
  }
`;

module.exports = typeDefs;
