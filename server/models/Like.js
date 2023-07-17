const { Schema, model } = require('mongoose');

// Likes are set up as when a user likes a post you would create a new Like doc wiht the username of the one who liked it  then we assign that an _id and push that to the likes array in the Post doc this is my goal / theory 

const LikeSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
});

const Like = model('Like', LikeSchema);

module.exports = Like;
