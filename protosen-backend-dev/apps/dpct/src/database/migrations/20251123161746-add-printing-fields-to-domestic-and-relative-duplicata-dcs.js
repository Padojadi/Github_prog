'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('domesticAndRelativeDuplicataDCs', 'issueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('domesticAndRelativeDuplicataDCs', 'validUntil', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('domesticAndRelativeDuplicataDCs', 'type_card', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('domesticAndRelativeDuplicataDCs', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('domesticAndRelativeDuplicataDCs', 'plaque', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });

    await queryInterface.addColumn('domesticAndRelativeDuplicataDCs', 'observation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('domesticAndRelativeDuplicataDCs', 'issueDate');
    await queryInterface.removeColumn('domesticAndRelativeDuplicataDCs', 'validUntil');
    await queryInterface.removeColumn('domesticAndRelativeDuplicataDCs', 'type_card');
    await queryInterface.removeColumn('domesticAndRelativeDuplicataDCs', 'color');
    await queryInterface.removeColumn('domesticAndRelativeDuplicataDCs', 'plaque');
    await queryInterface.removeColumn('domesticAndRelativeDuplicataDCs', 'observation');
  }
};
