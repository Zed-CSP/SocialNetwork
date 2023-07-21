const { gql } = require('apollo-server-express');



  const typeDefs = gql`

  scalar Upload

    type User {
    _id: ID!
    username: String!
    email: String!
    date_of_birth: String!
    posts: [Post]
    comments: [Comment]
  }

  type Post {
    _id: ID!
    content: String!
    photo: String
    user: User 
    volume: Int!
    likes: [Like]
    comments: [Comment]
    hashtags: [String]
    createdAt: String!
  }

  type Comment {
    _id: ID!
    content: String!
    user: User!
    post: Post!
    createdAt: String!
  }

  type Like {
    _id: ID!
    user: User
    post: Post!
    createdAt: String!
}


type Auth {
  token: ID!
  user: User
}

type Query {
  userFeed: [Post]
  me: User
  users: [User]
  user(username: String!): User
  posts(username: String): [Post]
  post(_id: ID!): Post
}

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, date_of_birth: String!, password: String!): Auth
  addPost(content: String!, photo: Upload): Post 
  addComment(postId: ID!, content: String!): Post
  likePost(postId: ID!): Post
  unlikePost(postId: ID!): Post
  deletePost(postId: ID!): User
}
`;

module.exports = typeDefs;
