const { Like } = require('../models');
const faker = require('faker');

const likeData = [];

for(let i=0; i<90; i++){
  likeData.push({
    user_id: Math.floor(Math.random() * 100) + 1,
    post_id: Math.floor(Math.random() * 130) + 1
  });
}

const seedLikes = () => Like.bulkCreate(likeData);

module.exports = seedLikes;
