'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('renewOtherDependantDCs', 'issueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('renewOtherDependantDCs', 'validUntil', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('renewOtherDependantDCs', 'type_card', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('renewOtherDependantDCs', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('renewOtherDependantDCs', 'plaque', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });

    await queryInterface.addColumn('renewOtherDependantDCs', 'observation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('renewOtherDependantDCs', 'issueDate');
    await queryInterface.removeColumn('renewOtherDependantDCs', 'validUntil');
    await queryInterface.removeColumn('renewOtherDependantDCs', 'type_card');
    await queryInterface.removeColumn('renewOtherDependantDCs', 'color');
    await queryInterface.removeColumn('renewOtherDependantDCs', 'plaque');
    await queryInterface.removeColumn('renewOtherDependantDCs', 'observation');
  }
};
