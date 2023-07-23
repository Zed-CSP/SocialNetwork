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
      comments { 
        _id
        content
        user {
          _id
          username
        }
        createdAt
      }
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id) {
      _id
      content
      
      comments {
        _id
        content
    
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

export const GET_USER = gql`
  query Me {
    me {
      _id
      username
      email
      date_of_birth
      profile_picture
      voice
      currency
      naughtyCount
    }
  }
`;

export const UPLOAD_AVATAR = gql`
  mutation uploadAvatar($avatar: Upload!) {
    uploadAvatar(avatar: $avatar)
  }
`;