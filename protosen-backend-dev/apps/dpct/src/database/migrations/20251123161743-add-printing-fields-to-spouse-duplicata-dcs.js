'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('spouseDuplicataDCs', 'issueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('spouseDuplicataDCs', 'validUntil', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('spouseDuplicataDCs', 'type_card', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('spouseDuplicataDCs', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('spouseDuplicataDCs', 'plaque', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });

    await queryInterface.addColumn('spouseDuplicataDCs', 'observation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('spouseDuplicataDCs', 'issueDate');
    await queryInterface.removeColumn('spouseDuplicataDCs', 'validUntil');
    await queryInterface.removeColumn('spouseDuplicataDCs', 'type_card');
    await queryInterface.removeColumn('spouseDuplicataDCs', 'color');
    await queryInterface.removeColumn('spouseDuplicataDCs', 'plaque');
    await queryInterface.removeColumn('spouseDuplicataDCs', 'observation');
  }
};
