'use strict';

const {
  embassies,
  consultat,
  au,
  un,
  orgInternationale,
  bankAndFI,
  foundationsAndOng,
} = require('./constant');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const institutions = [
      ...embassies,
      ...consultat,
      ...au,
      ...un,
      ...orgInternationale,
      ...bankAndFI,
      ...foundationsAndOng,
    ];

    const data = institutions.map((item) => ({
      id: Sequelize.literal('uuid_generate_v4()'),
      libelle: item.Libelle,
      institutionType: item.TypeOrganisme,
      service: item.Service ?? '',
      code: item.Code,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('institutions', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('institutions', null, {});
  },
};
