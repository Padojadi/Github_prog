'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('childDuplicataDCs', 'issueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('childDuplicataDCs', 'validUntil', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('childDuplicataDCs', 'type_card', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('childDuplicataDCs', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('childDuplicataDCs', 'plaque', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });

    await queryInterface.addColumn('childDuplicataDCs', 'observation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('childDuplicataDCs', 'issueDate');
    await queryInterface.removeColumn('childDuplicataDCs', 'validUntil');
    await queryInterface.removeColumn('childDuplicataDCs', 'type_card');
    await queryInterface.removeColumn('childDuplicataDCs', 'color');
    await queryInterface.removeColumn('childDuplicataDCs', 'plaque');
    await queryInterface.removeColumn('childDuplicataDCs', 'observation');
  }
};
