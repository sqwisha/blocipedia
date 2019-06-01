'use strict';
const faker = require('faker');
const bcrypt = require('bcryptjs');

let users = [];

for (let i = 1; i < 20; i++) {
  const salt = bcrypt.genSaltSync();
  const hashedPassword = bcrypt.hashSync(faker.internet.password(), salt);

  users.push({
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    password: hashedPassword,
    role: faker.random.number({min: 0, max: 2}),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
