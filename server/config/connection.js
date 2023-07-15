const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb+srv://samejones2018:daJ13l8h7WMj2CEp@cluster1.0gmkkgo.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

module.exports = mongoose.connection;
