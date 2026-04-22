'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('renewOwnerDCs', 'issueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('renewOwnerDCs', 'validUntil', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('renewOwnerDCs', 'type_card', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('renewOwnerDCs', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('renewOwnerDCs', 'plaque', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });

    await queryInterface.addColumn('renewOwnerDCs', 'observation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('renewOwnerDCs', 'issueDate');
    await queryInterface.removeColumn('renewOwnerDCs', 'validUntil');
    await queryInterface.removeColumn('renewOwnerDCs', 'type_card');
    await queryInterface.removeColumn('renewOwnerDCs', 'color');
    await queryInterface.removeColumn('renewOwnerDCs', 'plaque');
    await queryInterface.removeColumn('renewOwnerDCs', 'observation');
  }
};
