'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('renewChildDCs', 'issueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('renewChildDCs', 'validUntil', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('renewChildDCs', 'type_card', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('renewChildDCs', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('renewChildDCs', 'plaque', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });

    await queryInterface.addColumn('renewChildDCs', 'observation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('renewChildDCs', 'issueDate');
    await queryInterface.removeColumn('renewChildDCs', 'validUntil');
    await queryInterface.removeColumn('renewChildDCs', 'type_card');
    await queryInterface.removeColumn('renewChildDCs', 'color');
    await queryInterface.removeColumn('renewChildDCs', 'plaque');
    await queryInterface.removeColumn('renewChildDCs', 'observation');
  }
};
