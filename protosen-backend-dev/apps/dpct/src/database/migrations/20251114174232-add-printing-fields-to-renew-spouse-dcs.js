'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('renewSpouseDCs', 'issueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('renewSpouseDCs', 'validUntil', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('renewSpouseDCs', 'type_card', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('renewSpouseDCs', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('renewSpouseDCs', 'plaque', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });

    await queryInterface.addColumn('renewSpouseDCs', 'observation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('renewSpouseDCs', 'issueDate');
    await queryInterface.removeColumn('renewSpouseDCs', 'validUntil');
    await queryInterface.removeColumn('renewSpouseDCs', 'type_card');
    await queryInterface.removeColumn('renewSpouseDCs', 'color');
    await queryInterface.removeColumn('renewSpouseDCs', 'plaque');
    await queryInterface.removeColumn('renewSpouseDCs', 'observation');
  }
};
