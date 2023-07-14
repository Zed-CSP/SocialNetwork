const seedUsers = require('./users');
const seedPosts = require('./posts');
const seedComments = require('./comments');
const seedLikes = require('./likes');

const sequelize = require('../config/connection');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  
  await seedUsers();
  console.log('---- USERS SEEDED ----');
  
  await seedPosts();
  console.log('---- POSTS SEEDED ----');
  
  await seedComments();
  console.log('---- COMMENTS SEEDED ----');
  
  await seedLikes();
  console.log('---- LIKES SEEDED ----');
  
  process.exit(0);
};

seedAll();
