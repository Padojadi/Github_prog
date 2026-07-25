'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OwnerDiplomaticCardFiles', {
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
      lcKey: {
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
      ownerDiplomaticCardId: {
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
    await queryInterface.dropTable('OwnerDiplomaticCardFiles');
  }
};
