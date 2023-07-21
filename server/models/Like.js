const { Schema, model } = require('mongoose');

const LikeSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Like = model('Like', LikeSchema);

module.exports = Like;
