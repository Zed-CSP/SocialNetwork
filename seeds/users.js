const { User } = require('../models');
const faker = require('faker');

const userData = [];

for(let i=0; i<200; i++){
  userData.push({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    date_of_birth: faker.date.past(),
    password: faker.internet.password(),
    // profile_picture: faker.internet.avatar()
  });
}

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;
