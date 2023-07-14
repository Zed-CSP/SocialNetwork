const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const jwt = require('jsonwebtoken');
const { User } = require('./models');

// set up express app
const app = express();
const PORT = process.env.PORT || 3001;


const jwtSecret = process.env.JWT_SECRET;

// helper function to get a user's token from the request headers
const getUserFromToken = async (token) => {
  if (!token) {
    return null;
  }

  
  try {
    // remove 'Bearer ' just want the token itself
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    
    // decode the token using your secret key
    const { data } = jwt.verify(token, jwtSecret); 

    // find the user with the _id from the token
    const user = await User.findById(data._id);

    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};



// Create a new Apollo server and pass in the schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
  
    const token = req.headers.authorization || '';

    const user = await getUserFromToken(token);

    // return an object user
    return { user };
  },
});

// Start the Apollo server
(async function() {
  await server.start();
  server.applyMiddleware({ app });

  // middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  // serve index.html if we hit any route that isn't already specified
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

  // db.once called when the connection to the database is established
  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
})();
