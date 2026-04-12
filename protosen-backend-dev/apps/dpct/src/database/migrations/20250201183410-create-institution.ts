'use strict';

import { StrictStatusEnum } from "@shared/types";
import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
		await queryInterface.createTable('institutions', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			institutionType: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			code: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			libelle: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			service: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: '',
			},
			status: {
				type: Sequelize.ENUM(...Object.values(StrictStatusEnum)),
				defaultValue: StrictStatusEnum.ACTIVE,
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
	async down(queryInterface:QueryInterface, Sequelize:any) {
		await queryInterface.dropTable('institutions');
	},
};
