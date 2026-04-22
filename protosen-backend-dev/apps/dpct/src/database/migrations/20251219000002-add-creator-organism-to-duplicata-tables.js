'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const duplicataTables = [
      'ownerDuplicataDCs',
      'spouseDuplicataDCs',
      'childDuplicataDCs',
      'domesticAndRelativeDuplicataDCs',
      'otherDependantDuplicataDCs',
      'otherStaffDuplicataDCs',
    ];

    for (const tableName of duplicataTables) {
      // Add creatorId column
      await queryInterface.addColumn(tableName, 'creatorId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });

      // Add organismId column
      await queryInterface.addColumn(tableName, 'organismId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'institutions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });

      // Add indexes for performance
      await queryInterface.addIndex(tableName, ['creatorId'], {
        name: `idx_${tableName.toLowerCase()}_creator_id`,
      });
      await queryInterface.addIndex(tableName, ['organismId'], {
        name: `idx_${tableName.toLowerCase()}_organism_id`,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const duplicataTables = [
      'ownerDuplicataDCs',
      'spouseDuplicataDCs',
      'childDuplicataDCs',
      'domesticAndRelativeDuplicataDCs',
      'otherDependantDuplicataDCs',
      'otherStaffDuplicataDCs',
    ];

    for (const tableName of duplicataTables) {
      await queryInterface.removeIndex(tableName, `idx_${tableName.toLowerCase()}_creator_id`);
      await queryInterface.removeIndex(tableName, `idx_${tableName.toLowerCase()}_organism_id`);
      await queryInterface.removeColumn(tableName, 'creatorId');
      await queryInterface.removeColumn(tableName, 'organismId');
    }
  }
};
