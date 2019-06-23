'use strict';

const faker = require('faker');

let collaborators = [];

for (let i = 1; i < 30; i++) {
  collaborators.push({
    wikiId: faker.random.number({min: 1, max: 29}),
    userId: faker.random.number({min: 3, max: 19}),
    createdAt: new Date(),
    updatedAt: new Date()
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Collaborators', collaborators, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Collaborators', null, {});
  }
};
