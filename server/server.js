const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();



// set up express app
const app = express();
const PORT = process.env.PORT || 3001;


const jwtSecret = process.env.JWT_SECRET;

const getUserFromToken = async (token) => {
  if (!token) {
    console.log("Token not provided");
    return null;
  }
 
  try {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    console.log("Decoding token:", token);
    const { data } = jwt.verify(token, jwtSecret); 
    console.log("Token decoded. User ID:", data._id);

    const user = await User.findById(data._id);
    console.log("User fetched from database:", user);

    return user;
  } catch (err) {
    console.error("Error in getUserFromToken:", err);
    return null;
  }
};




// Create a new Apollo server and pass in the schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
  
    const token = req.headers.authorization || '';

    console.log(req.headers, ': - req in server.js');

    const user = await getUserFromToken(token);

    // return an object user
    return { user };
  },
  uploads: true
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
