const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;
