'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // List of all tables with documentStage enum
    const tables = [
      // Owner cards
      { table: 'OwnerDiplomaticCards', enumName: 'enum_OwnerDiplomaticCards_documentStage' },
      { table: 'ownerDuplicataDCs', enumName: 'enum_ownerDuplicataDCs_documentStage' },
      { table: 'renewOwnerDCs', enumName: 'enum_renewOwnerDCs_documentStage' },

      // Spouse cards
      { table: 'spouseDCs', enumName: 'enum_spouseDCs_documentStage' },
      { table: 'spouseDuplicataDCs', enumName: 'enum_spouseDuplicataDCs_documentStage' },
      { table: 'renewSpouseDCs', enumName: 'enum_renewSpouseDCs_documentStage' },

      // Child cards
      { table: 'childDCs', enumName: 'enum_childDCs_documentStage' },
      { table: 'childDuplicataDCs', enumName: 'enum_childDuplicataDCs_documentStage' },
      { table: 'renewChildDCs', enumName: 'enum_renewChildDCs_documentStage' },

      // Domestic and Relative cards
      { table: 'domesticAndRelativeDCs', enumName: 'enum_domesticAndRelativeDCs_documentStage' },
      { table: 'domesticAndRelativeDuplicataDCs', enumName: 'enum_domesticAndRelativeDuplicataDCs_documentStage' },
      { table: 'renewDomesticAndRelativeDCs', enumName: 'enum_renewDomesticAndRelativeDCs_documentStage' },

      // Other Dependant cards
      { table: 'otherDependantDCs', enumName: 'enum_otherDependantDCs_documentStage' },
      { table: 'otherDependantDuplicataDCs', enumName: 'enum_otherDependantDuplicataDCs_documentStage' },
      { table: 'renewOtherDependantDCs', enumName: 'enum_renewOtherDependantDCs_documentStage' },

      // Other Staff cards
      { table: 'otherStaffDCs', enumName: 'enum_otherStaffDCs_documentStage' },
      { table: 'otherStaffDuplicataDCs', enumName: 'enum_otherStaffDuplicataDCs_documentStage' },
      { table: 'renewOtherStaffDCs', enumName: 'enum_renewOtherStaffDCs_documentStage' },
    ];

    // Add RETURNED value to each enum type
    for (const { enumName } of tables) {
      await queryInterface.sequelize.query(
        `DO $$ BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_enum
            WHERE enumlabel = 'RETURNED'
            AND enumtypid = (SELECT oid FROM pg_type WHERE typname = '${enumName}')
          ) THEN
            ALTER TYPE "${enumName}" ADD VALUE 'RETURNED';
          END IF;
        END $$;`
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // Note: PostgreSQL does not support removing enum values directly
    // The proper way to rollback would be to:
    // 1. Create a new enum type without the RETURNED value
    // 2. Alter the column to use the new type
    // 3. Drop the old type
    // 4. Rename the new type to the old name

    // This is complex and risky, so we'll leave a comment instead
    console.log('WARNING: Rolling back enum values requires manual intervention.');
    console.log('PostgreSQL does not support removing enum values directly.');
    console.log('If you need to rollback, you will need to:');
    console.log('1. Ensure no data uses RETURNED value');
    console.log('2. Manually recreate the enum types without the RETURNED value');
  }
};
