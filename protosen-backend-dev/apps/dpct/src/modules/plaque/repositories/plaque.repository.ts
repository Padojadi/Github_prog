import { InferCreationAttributes } from 'sequelize';
import db, { Plaque } from 'database/models';

export class PlaqueRepository {
	static async create(data: InferCreationAttributes<Plaque>) {
		return await db.Plaque.create(data);
	}

	static async findAll() {
		return await db.Plaque.findAll();
	}

	static async findById(code: string) {
		return await db.Plaque.findByPk(code);
	}

	static async update(code: string, data: Partial<InferCreationAttributes<Plaque>>) {
		const cardType = await db.Plaque.findByPk(code);
		if (!cardType) {return null;}
		return await cardType.update(data);
	}

	static async delete(code: string) {
		const cardType = await db.Plaque.findByPk(code);
		if (!cardType) {return null;}
		await cardType.destroy();
		return cardType;
	}
}
