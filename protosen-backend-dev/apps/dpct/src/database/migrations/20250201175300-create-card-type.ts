'use strict';

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
		await queryInterface.createTable('CardType', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			observation: {
				type: Sequelize.ARRAY(Sequelize.TEXT),
				allowNull: false,
			},
		});
	},
	async down(queryInterface:QueryInterface, Sequelize:any) {
		await queryInterface.dropTable('CardType');
	},
};
