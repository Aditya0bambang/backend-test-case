"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Books", "status");
  },

  async down(queryInterface, Sequelize) {},
};
