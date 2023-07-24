import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $date_of_birth: String!, $password: String!) {
    addUser(username: $username, email: $email, date_of_birth: $date_of_birth, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;


export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;


export const ADD_POST = gql`
  mutation addPost($content: String!, $photo: Upload) {
    addPost(content: $content, photo: $photo) {
      _id
      content
      photo
      createdAt
      user {
        _id
        username
      }
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      _id
      likes {
        _id
        user {
          _id
          username
          interests
        }
      }
      hashtags
    }
  }
`;




export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: ID!) {
    unlikePost(postId: $postId) {
      _id
      likes {
        _id
        user {
          _id
          username
        }
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: $postId, content: $content) {
      _id
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

export const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      _id
      content
      likes {
        _id
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



