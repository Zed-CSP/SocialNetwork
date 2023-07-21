import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      _id
      content
      photo
      createdAt
      username
      likes {
        username
      }
    }
  }
`;

// rest of the queries...

 
export const GET_ME = gql`
query GetMe {
    me {
      username
      email
      _id
    }
  }
  
`;
