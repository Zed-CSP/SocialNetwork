const mongoose = require('mongoose');


mongoose.connect(
  'mongodb+srv://samejones2018:ZocUX1KNRoR0g5FL@cluster1.0gmkkgo.mongodb.net/?retryWrites=true&w=majority', 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const connection = mongoose.connection;

connection.once('open', async () => {
  console.log('Connected to the database');

  try {
    // Assuming you've already defined these models in your application
    const Post = require('./models/Post');
    const Like = require('./models/Like');
    const Comment = require('./models/Comment');
    const User = require('./models/User');

    // Remove all posts
    await Post.deleteMany({});
    console.log('All posts removed successfully');

    // Remove all likes
    await Like.deleteMany({});
    console.log('All likes removed successfully');

    // Remove all comments
    await Comment.deleteMany({});
    console.log('All comments removed successfully');

    // Remove all users
    await User.deleteMany({});
    console.log('All users removed successfully');

    connection.close();
    process.exit(0); // Exit normally
  } catch (err) {
    console.error('Error during cleanup:', err);
    connection.close();
    process.exit(1); // Exit with an error code
  }
});
