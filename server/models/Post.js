const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  photo: {
    type: String
  },
  user: {  
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  volume: {
    type: Number,
    default: 0
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Like'
  }],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  hashtags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = model('Post', postSchema);

module.exports = Post;
