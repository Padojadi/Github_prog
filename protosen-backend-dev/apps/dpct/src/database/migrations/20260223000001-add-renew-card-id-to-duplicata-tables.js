'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const config = [
      { table: 'ownerDuplicataDCs', refTable: 'renewOwnerDCs' },
      { table: 'spouseDuplicataDCs', refTable: 'renewSpouseDCs' },
      { table: 'childDuplicataDCs', refTable: 'renewChildDCs' },
      { table: 'domesticAndRelativeDuplicataDCs', refTable: 'renewDomesticAndRelativeDCs' },
      { table: 'otherDependantDuplicataDCs', refTable: 'renewOtherDependantDCs' },
      { table: 'otherStaffDuplicataDCs', refTable: 'renewOtherStaffDCs' },
    ];

    for (const { table, refTable } of config) {
      // Make previousCardId nullable (was NOT NULL — renew-based duplicata won't have it)
      await queryInterface.changeColumn(table, 'previousCardId', {
        type: Sequelize.UUID,
        allowNull: true,
      });

      // Add renewCardId column
      await queryInterface.addColumn(table, 'renewCardId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: refTable,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });

      // Add index for performance
      await queryInterface.addIndex(table, ['renewCardId'], {
        name: `idx_${table.toLowerCase()}_renew_card_id`,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const config = [
      'ownerDuplicataDCs',
      'spouseDuplicataDCs',
      'childDuplicataDCs',
      'domesticAndRelativeDuplicataDCs',
      'otherDependantDuplicataDCs',
      'otherStaffDuplicataDCs',
    ];

    for (const table of config) {
      await queryInterface.removeIndex(table, `idx_${table.toLowerCase()}_renew_card_id`);
      await queryInterface.removeColumn(table, 'renewCardId');
      await queryInterface.changeColumn(table, 'previousCardId', {
        type: Sequelize.UUID,
        allowNull: false,
      });
    }
  }
};
