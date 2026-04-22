'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ===== User Relations =====
    await queryInterface.addConstraint('Users', {
      fields: ['accessGroupId'],
      type: 'foreign key',
      name: 'fk_users_access_group',
      references: {
        table: 'AccessGroup',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('Users', {
      fields: ['organismId'],
      type: 'foreign key',
      name: 'fk_users_organism',
      references: {
        table: 'institutions',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    // ===== RefreshToken Relations =====
    await queryInterface.addConstraint('refreshTokens', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_refresh_tokens_user',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== OwnerDiplomaticCard Relations =====
    await queryInterface.addConstraint('OwnerDiplomaticCards', {
      fields: ['creatorId'],
      type: 'foreign key',
      name: 'fk_owner_dc_creator',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('OwnerDiplomaticCards', {
      fields: ['organismId'],
      type: 'foreign key',
      name: 'fk_owner_dc_organism',
      references: {
        table: 'institutions',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    // ===== OwnerDiplomaticCardFile Relations =====
    await queryInterface.addConstraint('OwnerDiplomaticCardFiles', {
      fields: ['ownerDiplomaticCardId'],
      type: 'foreign key',
      name: 'fk_owner_dc_file_owner_dc',
      references: {
        table: 'OwnerDiplomaticCards',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== OwnerDuplicataDC Relations =====
    await queryInterface.addConstraint('ownerDuplicataDCs', {
      fields: ['previousCardId'],
      type: 'foreign key',
      name: 'fk_owner_duplicata_previous_card',
      references: {
        table: 'OwnerDiplomaticCards',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== RenewOwnerDC Relations =====
    await queryInterface.addConstraint('renewOwnerDCs', {
      fields: ['previousCardId'],
      type: 'foreign key',
      name: 'fk_renew_owner_dc_previous_card',
      references: {
        table: 'OwnerDiplomaticCards',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== SpouseDC Relations =====
    await queryInterface.addConstraint('spouseDCs', {
      fields: ['ownerDiplomaticCardId'],
      type: 'foreign key',
      name: 'fk_spouse_dc_owner_dc',
      references: {
        table: 'OwnerDiplomaticCards',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('spouseDCs', {
      fields: ['creatorId'],
      type: 'foreign key',
      name: 'fk_spouse_dc_creator',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('spouseDCs', {
      fields: ['organismId'],
      type: 'foreign key',
      name: 'fk_spouse_dc_organism',
      references: {
        table: 'institutions',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    // ===== SpouseDCFile Relations =====
    await queryInterface.addConstraint('spouseDCFiles', {
      fields: ['spouseDCId'],
      type: 'foreign key',
      name: 'fk_spouse_dc_file_spouse_dc',
      references: {
        table: 'spouseDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== SpouseDuplicataDC Relations =====
    await queryInterface.addConstraint('spouseDuplicataDCs', {
      fields: ['previousCardId'],
      type: 'foreign key',
      name: 'fk_spouse_duplicata_previous_card',
      references: {
        table: 'spouseDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== RenewSpouseDC Relations =====
    await queryInterface.addConstraint('renewSpouseDCs', {
      fields: ['previousCardId'],
      type: 'foreign key',
      name: 'fk_renew_spouse_dc_previous_card',
      references: {
        table: 'spouseDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== ChildDC Relations =====
    await queryInterface.addConstraint('childDCs', {
      fields: ['ownerDiplomaticCardId'],
      type: 'foreign key',
      name: 'fk_child_dc_owner_dc',
      references: {
        table: 'OwnerDiplomaticCards',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('childDCs', {
      fields: ['creatorId'],
      type: 'foreign key',
      name: 'fk_child_dc_creator',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('childDCs', {
      fields: ['organismId'],
      type: 'foreign key',
      name: 'fk_child_dc_organism',
      references: {
        table: 'institutions',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    // ===== ChildDCFile Relations =====
    await queryInterface.addConstraint('childDCFiles', {
      fields: ['childDCId'],
      type: 'foreign key',
      name: 'fk_child_dc_file_child_dc',
      references: {
        table: 'childDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== ChildDuplicataDC Relations =====
    await queryInterface.addConstraint('childDuplicataDCs', {
      fields: ['previousCardId'],
      type: 'foreign key',
      name: 'fk_child_duplicata_previous_card',
      references: {
        table: 'childDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== RenewChildDC Relations =====
    await queryInterface.addConstraint('renewChildDCs', {
      fields: ['previousCardId'],
      type: 'foreign key',
      name: 'fk_renew_child_dc_previous_card',
      references: {
        table: 'childDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== DomesticAndRelativeDC Relations =====
    await queryInterface.addConstraint('domesticAndRelativeDCs', {
      fields: ['ownerDiplomaticCardId'],
      type: 'foreign key',
      name: 'fk_domestic_relative_dc_owner_dc',
      references: {
        table: 'OwnerDiplomaticCards',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('domesticAndRelativeDCs', {
      fields: ['creatorId'],
      type: 'foreign key',
      name: 'fk_domestic_relative_dc_creator',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('domesticAndRelativeDCs', {
      fields: ['organismId'],
      type: 'foreign key',
      name: 'fk_domestic_relative_dc_organism',
      references: {
        table: 'institutions',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    // ===== DomesticAndRelativeDCFile Relations =====
    await queryInterface.addConstraint('domesticAndRelativeDCFiles', {
      fields: ['domesticAndRelativeDCId'],
      type: 'foreign key',
      name: 'fk_domestic_relative_dc_file_dc',
      references: {
        table: 'domesticAndRelativeDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== DomesticAndRelativeDuplicataDC Relations =====
    await queryInterface.addConstraint('domesticAndRelativeDuplicataDCs', {
      fields: ['previousCardId'],
      type: 'foreign key',
      name: 'fk_domestic_relative_duplicata_previous_card',
      references: {
        table: 'domesticAndRelativeDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== RenewDomesticAndRelativeDC Relations =====
    await queryInterface.addConstraint('renewDomesticAndRelativeDCs', {
      fields: ['previousCardId'],
      type: 'foreign key',
      name: 'fk_renew_domestic_relative_dc_previous_card',
      references: {
        table: 'domesticAndRelativeDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== OtherDependantDC Relations =====
    await queryInterface.addConstraint('otherDependantDCs', {
      fields: ['ownerDiplomaticCardId'],
      type: 'foreign key',
      name: 'fk_other_dependant_dc_owner_dc',
      references: {
        table: 'OwnerDiplomaticCards',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('otherDependantDCs', {
      fields: ['creatorId'],
      type: 'foreign key',
      name: 'fk_other_dependant_dc_creator',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('otherDependantDCs', {
      fields: ['organismId'],
      type: 'foreign key',
      name: 'fk_other_dependant_dc_organism',
      references: {
        table: 'institutions',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    // ===== OtherDependantDCFile Relations =====
    await queryInterface.addConstraint('otherDependantDCFiles', {
      fields: ['otherDependantDCId'],
      type: 'foreign key',
      name: 'fk_other_dependant_dc_file_dc',
      references: {
        table: 'otherDependantDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== OtherDependantDuplicataDC Relations =====
    await queryInterface.addConstraint('otherDependantDuplicataDCs', {
      fields: ['previousCardId'],
      type: 'foreign key',
      name: 'fk_other_dependant_duplicata_previous_card',
      references: {
        table: 'otherDependantDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== RenewOtherDependantDC Relations =====
    await queryInterface.addConstraint('renewOtherDependantDCs', {
      fields: ['previousCardId'],
      type: 'foreign key',
      name: 'fk_renew_other_dependant_dc_previous_card',
      references: {
        table: 'otherDependantDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== OtherStaffDC Relations =====
    await queryInterface.addConstraint('otherStaffDCs', {
      fields: ['ownerDiplomaticCardId'],
      type: 'foreign key',
      name: 'fk_other_staff_dc_owner_dc',
      references: {
        table: 'OwnerDiplomaticCards',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('otherStaffDCs', {
      fields: ['creatorId'],
      type: 'foreign key',
      name: 'fk_other_staff_dc_creator',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('otherStaffDCs', {
      fields: ['organismId'],
      type: 'foreign key',
      name: 'fk_other_staff_dc_organism',
      references: {
        table: 'institutions',
        field: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    // ===== OtherStaffDCFile Relations =====
    await queryInterface.addConstraint('otherStaffDCFiles', {
      fields: ['otherStaffDCId'],
      type: 'foreign key',
      name: 'fk_other_staff_dc_file_dc',
      references: {
        table: 'otherStaffDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== OtherStaffDuplicataDC Relations =====
    await queryInterface.addConstraint('otherStaffDuplicataDCs', {
      fields: ['previousCardId'],
      type: 'foreign key',
      name: 'fk_other_staff_duplicata_previous_card',
      references: {
        table: 'otherStaffDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // ===== RenewOtherStaffDC Relations =====
    await queryInterface.addConstraint('renewOtherStaffDCs', {
      fields: ['previousCardId'],
      type: 'foreign key',
      name: 'fk_renew_other_staff_dc_previous_card',
      references: {
        table: 'otherStaffDCs',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Add indexes for foreign keys to improve query performance
    await queryInterface.addIndex('Users', ['accessGroupId'], { name: 'idx_users_access_group_id' });
    await queryInterface.addIndex('Users', ['organismId'], { name: 'idx_users_organism_id' });

    await queryInterface.addIndex('OwnerDiplomaticCards', ['creatorId'], { name: 'idx_owner_dc_creator_id' });
    await queryInterface.addIndex('OwnerDiplomaticCards', ['organismId'], { name: 'idx_owner_dc_organism_id' });

    await queryInterface.addIndex('spouseDCs', ['ownerDiplomaticCardId'], { name: 'idx_spouse_dc_owner_dc_id' });
    await queryInterface.addIndex('spouseDCs', ['creatorId'], { name: 'idx_spouse_dc_creator_id' });
    await queryInterface.addIndex('spouseDCs', ['organismId'], { name: 'idx_spouse_dc_organism_id' });

    await queryInterface.addIndex('childDCs', ['ownerDiplomaticCardId'], { name: 'idx_child_dc_owner_dc_id' });
    await queryInterface.addIndex('childDCs', ['creatorId'], { name: 'idx_child_dc_creator_id' });
    await queryInterface.addIndex('childDCs', ['organismId'], { name: 'idx_child_dc_organism_id' });

    await queryInterface.addIndex('domesticAndRelativeDCs', ['ownerDiplomaticCardId'], { name: 'idx_domestic_relative_dc_owner_dc_id' });
    await queryInterface.addIndex('domesticAndRelativeDCs', ['creatorId'], { name: 'idx_domestic_relative_dc_creator_id' });
    await queryInterface.addIndex('domesticAndRelativeDCs', ['organismId'], { name: 'idx_domestic_relative_dc_organism_id' });

    await queryInterface.addIndex('otherDependantDCs', ['ownerDiplomaticCardId'], { name: 'idx_other_dependant_dc_owner_dc_id' });
    await queryInterface.addIndex('otherDependantDCs', ['creatorId'], { name: 'idx_other_dependant_dc_creator_id' });
    await queryInterface.addIndex('otherDependantDCs', ['organismId'], { name: 'idx_other_dependant_dc_organism_id' });

    await queryInterface.addIndex('otherStaffDCs', ['ownerDiplomaticCardId'], { name: 'idx_other_staff_dc_owner_dc_id' });
    await queryInterface.addIndex('otherStaffDCs', ['creatorId'], { name: 'idx_other_staff_dc_creator_id' });
    await queryInterface.addIndex('otherStaffDCs', ['organismId'], { name: 'idx_other_staff_dc_organism_id' });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes
    await queryInterface.removeIndex('otherStaffDCs', 'idx_other_staff_dc_organism_id');
    await queryInterface.removeIndex('otherStaffDCs', 'idx_other_staff_dc_creator_id');
    await queryInterface.removeIndex('otherStaffDCs', 'idx_other_staff_dc_owner_dc_id');

    await queryInterface.removeIndex('otherDependantDCs', 'idx_other_dependant_dc_organism_id');
    await queryInterface.removeIndex('otherDependantDCs', 'idx_other_dependant_dc_creator_id');
    await queryInterface.removeIndex('otherDependantDCs', 'idx_other_dependant_dc_owner_dc_id');

    await queryInterface.removeIndex('domesticAndRelativeDCs', 'idx_domestic_relative_dc_organism_id');
    await queryInterface.removeIndex('domesticAndRelativeDCs', 'idx_domestic_relative_dc_creator_id');
    await queryInterface.removeIndex('domesticAndRelativeDCs', 'idx_domestic_relative_dc_owner_dc_id');

    await queryInterface.removeIndex('childDCs', 'idx_child_dc_organism_id');
    await queryInterface.removeIndex('childDCs', 'idx_child_dc_creator_id');
    await queryInterface.removeIndex('childDCs', 'idx_child_dc_owner_dc_id');

    await queryInterface.removeIndex('spouseDCs', 'idx_spouse_dc_organism_id');
    await queryInterface.removeIndex('spouseDCs', 'idx_spouse_dc_creator_id');
    await queryInterface.removeIndex('spouseDCs', 'idx_spouse_dc_owner_dc_id');

    await queryInterface.removeIndex('OwnerDiplomaticCards', 'idx_owner_dc_organism_id');
    await queryInterface.removeIndex('OwnerDiplomaticCards', 'idx_owner_dc_creator_id');

    await queryInterface.removeIndex('Users', 'idx_users_organism_id');
    await queryInterface.removeIndex('Users', 'idx_users_access_group_id');

    // Remove all foreign key constraints
    await queryInterface.removeConstraint('renewOtherStaffDCs', 'fk_renew_other_staff_dc_previous_card');
    await queryInterface.removeConstraint('otherStaffDuplicataDCs', 'fk_other_staff_duplicata_previous_card');
    await queryInterface.removeConstraint('otherStaffDCFiles', 'fk_other_staff_dc_file_dc');
    await queryInterface.removeConstraint('otherStaffDCs', 'fk_other_staff_dc_organism');
    await queryInterface.removeConstraint('otherStaffDCs', 'fk_other_staff_dc_creator');
    await queryInterface.removeConstraint('otherStaffDCs', 'fk_other_staff_dc_owner_dc');

    await queryInterface.removeConstraint('renewOtherDependantDCs', 'fk_renew_other_dependant_dc_previous_card');
    await queryInterface.removeConstraint('otherDependantDuplicataDCs', 'fk_other_dependant_duplicata_previous_card');
    await queryInterface.removeConstraint('otherDependantDCFiles', 'fk_other_dependant_dc_file_dc');
    await queryInterface.removeConstraint('otherDependantDCs', 'fk_other_dependant_dc_organism');
    await queryInterface.removeConstraint('otherDependantDCs', 'fk_other_dependant_dc_creator');
    await queryInterface.removeConstraint('otherDependantDCs', 'fk_other_dependant_dc_owner_dc');

    await queryInterface.removeConstraint('renewDomesticAndRelativeDCs', 'fk_renew_domestic_relative_dc_previous_card');
    await queryInterface.removeConstraint('domesticAndRelativeDuplicataDCs', 'fk_domestic_relative_duplicata_previous_card');
    await queryInterface.removeConstraint('domesticAndRelativeDCFiles', 'fk_domestic_relative_dc_file_dc');
    await queryInterface.removeConstraint('domesticAndRelativeDCs', 'fk_domestic_relative_dc_organism');
    await queryInterface.removeConstraint('domesticAndRelativeDCs', 'fk_domestic_relative_dc_creator');
    await queryInterface.removeConstraint('domesticAndRelativeDCs', 'fk_domestic_relative_dc_owner_dc');

    await queryInterface.removeConstraint('renewChildDCs', 'fk_renew_child_dc_previous_card');
    await queryInterface.removeConstraint('childDuplicataDCs', 'fk_child_duplicata_previous_card');
    await queryInterface.removeConstraint('childDCFiles', 'fk_child_dc_file_child_dc');
    await queryInterface.removeConstraint('childDCs', 'fk_child_dc_organism');
    await queryInterface.removeConstraint('childDCs', 'fk_child_dc_creator');
    await queryInterface.removeConstraint('childDCs', 'fk_child_dc_owner_dc');

    await queryInterface.removeConstraint('renewSpouseDCs', 'fk_renew_spouse_dc_previous_card');
    await queryInterface.removeConstraint('spouseDuplicataDCs', 'fk_spouse_duplicata_previous_card');
    await queryInterface.removeConstraint('spouseDCFiles', 'fk_spouse_dc_file_spouse_dc');
    await queryInterface.removeConstraint('spouseDCs', 'fk_spouse_dc_organism');
    await queryInterface.removeConstraint('spouseDCs', 'fk_spouse_dc_creator');
    await queryInterface.removeConstraint('spouseDCs', 'fk_spouse_dc_owner_dc');

    await queryInterface.removeConstraint('renewOwnerDCs', 'fk_renew_owner_dc_previous_card');
    await queryInterface.removeConstraint('ownerDuplicataDCs', 'fk_owner_duplicata_previous_card');
    await queryInterface.removeConstraint('OwnerDiplomaticCardFiles', 'fk_owner_dc_file_owner_dc');
    await queryInterface.removeConstraint('OwnerDiplomaticCards', 'fk_owner_dc_organism');
    await queryInterface.removeConstraint('OwnerDiplomaticCards', 'fk_owner_dc_creator');

    await queryInterface.removeConstraint('refreshTokens', 'fk_refresh_tokens_user');
    await queryInterface.removeConstraint('Users', 'fk_users_organism');
    await queryInterface.removeConstraint('Users', 'fk_users_access_group');
  }
};
