const { Comment } = require('../models');
const faker = require('faker');

const commentData = [];

for (let i = 0; i < 500; i++) {
    commentData.push({
        content: faker.lorem.words(),
        user_id: Math.floor(Math.random() * 120) + 1,
        post_id: Math.floor(Math.random() * 120) + 1

    });
}

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;
