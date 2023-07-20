const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const user = await getUserFromToken(token);
    return { user };
  },
  uploads: true
});

(async function() {
  await server.start();
  
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Add right after server.start()
app.use((req, res, next) => {
  console.log("Incoming Request Body:", req.body);
  next();
});


  // Apollo middleware
  server.applyMiddleware({ app });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
  }

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
})();
