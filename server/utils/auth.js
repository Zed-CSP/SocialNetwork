const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
const expiration = '2h';

module.exports = {
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  
  authMiddleware: function ({ req }) {
    
    // Only retrieve tokens from the authorization header
    let token = req.headers.authorization;
    
    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ').pop().trim();
    } else {
      // If no token, return request object as is
      return req;
    }
    
    try {
      const { data } = jwt.verify(token, secret);
      req.user = data;
    } catch (err) {
      console.log('Error decoding token:', err.message);
    }
    
    return req;
  },
};
