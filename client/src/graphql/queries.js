import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      _id
      content
      photo
      createdAt
      username
    }
  }
`;
