'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create OwnerDiplomaticCards table
    await queryInterface.createTable('OwnerDiplomaticCards', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
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
      matrimonialStatus: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'),
        allowNull: false,
      },
      plaque: {
        type: Sequelize.STRING(4),
        allowNull: true,
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
      grade: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      personReplaced: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      cardNumber: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      jobFunction: {
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
      dateTakingOffice: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      dateArrivalSenegal: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      travellingTitleValidUntil: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      dateEndOfMission: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      lastCityAbroad: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      adressSenegal: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      lastCountryAbroad: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      latestOfWorkCountry: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      latestWorkStructure: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      lastestWorkDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      lastStreetAbroad: {
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
      validUntil: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      expired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OwnerDiplomaticCards');
  }
};
