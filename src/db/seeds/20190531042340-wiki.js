'use strict';

const faker = require('faker');

let wikis = [];

for (let i = 1; i < 30; i++) {
  wikis.push({
    title:faker.lorem.words(),
    body: faker.lorem.paragraphs(),
    private: faker.random.boolean(),
    userId: faker.random.number({min: 1, max: 19}),
    createdAt: new Date(),
    updatedAt: new Date()
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Wikis', wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Wikis', null, {});
  }
};
