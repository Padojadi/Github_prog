'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('renewDomesticAndRelativeDCs', 'issueDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('renewDomesticAndRelativeDCs', 'validUntil', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('renewDomesticAndRelativeDCs', 'type_card', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn('renewDomesticAndRelativeDCs', 'color', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    await queryInterface.addColumn('renewDomesticAndRelativeDCs', 'plaque', {
      type: Sequelize.STRING(4),
      allowNull: true,
    });

    await queryInterface.addColumn('renewDomesticAndRelativeDCs', 'observation', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('renewDomesticAndRelativeDCs', 'issueDate');
    await queryInterface.removeColumn('renewDomesticAndRelativeDCs', 'validUntil');
    await queryInterface.removeColumn('renewDomesticAndRelativeDCs', 'type_card');
    await queryInterface.removeColumn('renewDomesticAndRelativeDCs', 'color');
    await queryInterface.removeColumn('renewDomesticAndRelativeDCs', 'plaque');
    await queryInterface.removeColumn('renewDomesticAndRelativeDCs', 'observation');
  }
};
