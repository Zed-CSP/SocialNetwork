const { Schema, model } = require('mongoose');


const PostSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  photo: {  // for storing the S3 URL of the image.
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  volume: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like',
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  hashtags: [
    {
      type: String,
    },
  ],
});

const Post = model('Post', PostSchema);

module.exports = Post;
