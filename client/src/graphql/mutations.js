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


export const CREATE_POST = gql`
  mutation CreatePost($content: String!, $imageUrl: String!) {
    createPost(content: $content, imageUrl: $imageUrl) {
      _id
      content
      imageUrl
      createdAt
      username
    }
  }
`;
