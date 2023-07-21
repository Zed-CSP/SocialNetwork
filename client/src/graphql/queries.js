import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query posts {
    posts {
      _id
      content
      photo
      createdAt
      user {
        _id
        username
      }
      likes {
        _id
        user {
          _id
          username
        }
        createdAt
        post {
          _id
        }
      }
    }
  }
`;
 
export const GET_ME = gql`
query GetMe {
    me {
      username
      email
      _id
    }
  }
  
`;
