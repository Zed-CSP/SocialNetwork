import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { createUploadLink } from 'apollo-upload-client';

// Use an environment variable or default to localhost
const APOLLO_SERVER_ENDPOINT = process.env.REACT_APP_APOLLO_SERVER_ENDPOINT || 'http://localhost:3001/graphql';

// Use createUploadLink instead of HttpLink for file uploads
const uploadLink = createUploadLink({
  uri: APOLLO_SERVER_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
    // Combine the authentication and upload links
    link: authLink.concat(uploadLink),
    cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
