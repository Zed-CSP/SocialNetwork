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
      username
    }
  }
`;

