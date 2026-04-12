'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('renewOtherStaffDCs', 'issueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('renewOtherStaffDCs', 'validUntil', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('renewOtherStaffDCs', 'type_card', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('renewOtherStaffDCs', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('renewOtherStaffDCs', 'plaque', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });

    await queryInterface.addColumn('renewOtherStaffDCs', 'observation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('renewOtherStaffDCs', 'issueDate');
    await queryInterface.removeColumn('renewOtherStaffDCs', 'validUntil');
    await queryInterface.removeColumn('renewOtherStaffDCs', 'type_card');
    await queryInterface.removeColumn('renewOtherStaffDCs', 'color');
    await queryInterface.removeColumn('renewOtherStaffDCs', 'plaque');
    await queryInterface.removeColumn('renewOtherStaffDCs', 'observation');
  }
};
