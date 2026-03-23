'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create domesticAndRelativeDCs table
    await queryInterface.createTable('domesticAndRelativeDCs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      cardNumber: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'),
        allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      placeOfBirth: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      citizenship: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      countryOfBirth: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      travellingNumber: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      deliverAt: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      deliverBy: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      deliverThe: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      issueDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      travellingTitleType: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      travellingTitleValidUntil: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      rejectReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      documentStage: {
        type: Sequelize.ENUM('ONHOLD', 'PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'ONHOLD',
      },
      demandType: {
        type: Sequelize.ENUM('NEW', 'RENEWAL', 'DUPLICATE'),
        allowNull: false,
        defaultValue: 'NEW',
      },
      expired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      validUntil: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      type_card: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      observation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ownerDiplomaticCardId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      creatorId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      organismId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Create domesticAndRelativeDCFiles table
    await queryInterface.createTable('domesticAndRelativeDCFiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      passportKey: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      adKey: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      photoKey: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      othersKey: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      domesticAndRelativeDCId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Create domesticAndRelativeDuplicataDCs table
    await queryInterface.createTable('domesticAndRelativeDuplicataDCs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      rejectReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      documentStage: {
        type: Sequelize.ENUM('ONHOLD', 'PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'ONHOLD',
      },
      previousCardId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Create renewDomesticAndRelativeDCs table
    await queryInterface.createTable('renewDomesticAndRelativeDCs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      rejectReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      documentStage: {
        type: Sequelize.ENUM('ONHOLD', 'PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'ONHOLD',
      },
      cardNumber: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      newDateEndOfMission: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      expired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      previousCardId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('renewDomesticAndRelativeDCs');
    await queryInterface.dropTable('domesticAndRelativeDuplicataDCs');
    await queryInterface.dropTable('domesticAndRelativeDCFiles');
    await queryInterface.dropTable('domesticAndRelativeDCs');
  }
};
