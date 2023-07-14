const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const expiration = '2h';


module.exports = {
  // function for our authenticated routes
  signToken: function ({ username, email, _id }) {
    // create a token with the username, email, and id
    const payload = { username, email, _id };
    // sign the token with secret key / expiration date
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  // function for our unauthenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {  
      token = token.split(' ').pop().trim();
    }
    // if no token, return request object as is
    if (!token) {
      return req;
    }
    // otherwise decode and attach decoded user data to request object
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (err) {
      console.log('Error decoding token:', err.message);
    }
    return req;
  },
};
