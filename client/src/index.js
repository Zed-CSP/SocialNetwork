import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe('stripe_public_key'); // stripe_public_key is our future public key

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <ApolloProvider client={client}>
        <Elements stripe={stripePromise}> 
            <App /> 
        </Elements>
    </ApolloProvider>

);
//stripe wants app to be wrapped in Elements component. 


