'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ownerDuplicataDCs', 'issueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('ownerDuplicataDCs', 'validUntil', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('ownerDuplicataDCs', 'type_card', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('ownerDuplicataDCs', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('ownerDuplicataDCs', 'plaque', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });

    await queryInterface.addColumn('ownerDuplicataDCs', 'observation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ownerDuplicataDCs', 'issueDate');
    await queryInterface.removeColumn('ownerDuplicataDCs', 'validUntil');
    await queryInterface.removeColumn('ownerDuplicataDCs', 'type_card');
    await queryInterface.removeColumn('ownerDuplicataDCs', 'color');
    await queryInterface.removeColumn('ownerDuplicataDCs', 'plaque');
    await queryInterface.removeColumn('ownerDuplicataDCs', 'observation');
  }
};
