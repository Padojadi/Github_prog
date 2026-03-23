import { InferCreationAttributes } from 'sequelize';
import db, { CardType } from 'database/models';

export class CardTypeRepository {
	static async create(data: InferCreationAttributes<CardType>) {
		return await db.CardType.create(data);
	}

	static async findAll() {
		return await db.CardType.findAll();
	}

	static async findById(id: string) {
		return await db.CardType.findByPk(id);
	}

	static async update(id: string, data: Partial<InferCreationAttributes<CardType>>) {
		const cardType = await db.CardType.findByPk(id);
		if (!cardType) {return null;}
		return await cardType.update(data);
	}

	static async delete(id: string) {
		const cardType = await db.CardType.findByPk(id);
		if (!cardType) {return null;}
		await cardType.destroy();
		return cardType;
	}
}
