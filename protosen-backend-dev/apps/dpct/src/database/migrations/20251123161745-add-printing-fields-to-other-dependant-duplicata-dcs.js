'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('otherDependantDuplicataDCs', 'issueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('otherDependantDuplicataDCs', 'validUntil', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('otherDependantDuplicataDCs', 'type_card', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('otherDependantDuplicataDCs', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('otherDependantDuplicataDCs', 'plaque', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });

    await queryInterface.addColumn('otherDependantDuplicataDCs', 'observation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('otherDependantDuplicataDCs', 'issueDate');
    await queryInterface.removeColumn('otherDependantDuplicataDCs', 'validUntil');
    await queryInterface.removeColumn('otherDependantDuplicataDCs', 'type_card');
    await queryInterface.removeColumn('otherDependantDuplicataDCs', 'color');
    await queryInterface.removeColumn('otherDependantDuplicataDCs', 'plaque');
    await queryInterface.removeColumn('otherDependantDuplicataDCs', 'observation');
  }
};
