const { Post } = require('../models');
const faker = require('faker');

const postData = [];

for(let i=0; i<130; i++){
  postData.push({
    title: faker.lorem.words(),
    content: faker.lorem.words(),
    user_id: Math.floor(Math.random() * 150) + 1
  });
}

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;
