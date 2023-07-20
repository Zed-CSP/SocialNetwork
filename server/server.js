const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const jwt = require('jsonwebtoken');
const { User } = require('./models/User');
require('dotenv').config();

// set up express app
const app = express();
const PORT = process.env.PORT || 3001;


const jwtSecret = process.env.JWT_SECRET;

async function getUserFromToken(token) {
  console.log('token getting user in server.js in getUserFromToken', token)
  if (!token) return null;

  try {
      // If you're using JWTs, for instance, you might do something like:
      const decoded = jwt.verify(token, YOUR_SECRET_KEY);
      const user = await User.findById(decoded.id);

      return user;
  } catch (err) {
      return null;
  }
}




const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
  
    const token = req.headers.authorization || '';

    const user = await getUserFromToken(token);

    return { user }; // This will either be the user object or null
  }
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
