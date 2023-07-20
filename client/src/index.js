import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createUploadLink } from 'apollo-upload-client';

const stripePromise = loadStripe('stripe_public_key'); // make sure to replace 'stripe_public_key' with your actual public key

// Create the upload link for Apollo Client
const uploadLink = createUploadLink({
    uri: 'http://localhost:3001/graphql',
    headers: {
        'keep-alive': 'true'
      }
});

// Initialize the Apollo Client with the upload link
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: uploadLink
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ApolloProvider client={client}>
        <Elements stripe={stripePromise}> 
            <App /> 
        </Elements>
    </ApolloProvider>
);
