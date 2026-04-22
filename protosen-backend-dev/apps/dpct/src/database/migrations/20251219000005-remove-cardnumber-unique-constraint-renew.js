'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const renewTables = [
      'renewOwnerDCs',
      'renewSpouseDCs',
      'renewChildDCs',
      'renewDomesticAndRelativeDCs',
      'renewOtherDependantDCs',
      'renewOtherStaffDCs',
    ];

    for (const table of renewTables) {
      try {
        // Retirer la contrainte d'unicité sur cardNumber
        await queryInterface.removeConstraint(table, `${table}_cardNumber_key`);
        console.log(`✓ Removed unique constraint on cardNumber for ${table}`);
      } catch (error) {
        // La contrainte peut avoir un nom différent, essayer avec un autre format
        try {
          await queryInterface.sequelize.query(`
            ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${table}_cardNumber_key";
          `);
          console.log(`✓ Removed unique constraint (SQL) on cardNumber for ${table}`);
        } catch (err) {
          console.log(`⚠ No constraint found for ${table}, skipping...`);
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const renewTables = [
      'renewOwnerDCs',
      'renewSpouseDCs',
      'renewChildDCs',
      'renewDomesticAndRelativeDCs',
      'renewOtherDependantDCs',
      'renewOtherStaffDCs',
    ];

    for (const table of renewTables) {
      try {
        await queryInterface.addConstraint(table, {
          fields: ['cardNumber'],
          type: 'unique',
          name: `${table}_cardNumber_key`,
        });
        console.log(`✓ Added unique constraint on cardNumber for ${table}`);
      } catch (error) {
        console.log(`⚠ Could not add constraint for ${table}: ${error.message}`);
      }
    }
  }
};
