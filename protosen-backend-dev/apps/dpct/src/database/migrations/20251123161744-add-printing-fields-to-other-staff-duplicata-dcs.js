'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('otherStaffDuplicataDCs', 'issueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('otherStaffDuplicataDCs', 'validUntil', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('otherStaffDuplicataDCs', 'type_card', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('otherStaffDuplicataDCs', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('otherStaffDuplicataDCs', 'plaque', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });

    await queryInterface.addColumn('otherStaffDuplicataDCs', 'observation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('otherStaffDuplicataDCs', 'issueDate');
    await queryInterface.removeColumn('otherStaffDuplicataDCs', 'validUntil');
    await queryInterface.removeColumn('otherStaffDuplicataDCs', 'type_card');
    await queryInterface.removeColumn('otherStaffDuplicataDCs', 'color');
    await queryInterface.removeColumn('otherStaffDuplicataDCs', 'plaque');
    await queryInterface.removeColumn('otherStaffDuplicataDCs', 'observation');
  }
};
