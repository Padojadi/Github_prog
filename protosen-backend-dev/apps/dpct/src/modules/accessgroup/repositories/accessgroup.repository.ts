import { InferCreationAttributes } from 'sequelize';
import db, { AccessGroup } from '@database/models';

export class AccessGroupRepository {
	static async create(data: InferCreationAttributes<AccessGroup>) {
		return await db.AccessGroup.create(data);
	}

	static async findAll() {
		return await db.AccessGroup.findAll();
	}

	static async findById(id: string) {
		return await db.AccessGroup.findByPk(id);
	}

	static async update(id: string, data: Partial<InferCreationAttributes<AccessGroup>>) {
		const access = await db.AccessGroup.findByPk(id);
		if (!access) {return null;}
		return await access.update(data);
	}

	static async delete(id: string) {
		const access = await db.AccessGroup.findByPk(id);
		if (!access) {return null;}
		await access.destroy();
		return access;
	}
}
