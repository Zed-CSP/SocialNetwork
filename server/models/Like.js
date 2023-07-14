const { Schema, model } = require('mongoose');

const LikeSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
});

const Like = model('Like', LikeSchema);

module.exports = Like;
