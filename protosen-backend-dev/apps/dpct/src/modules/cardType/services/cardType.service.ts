import { CardTypeRepository } from '../repositories/cardType.repository';
import { CreateCardTypeInput } from '../dtos/cardType.dto';

export class CardTypeService {
	static async createCardType(data: CreateCardTypeInput) {
		return await CardTypeRepository.create(data as any);
	}

	static async getAllCardTypes() {
		return await CardTypeRepository.findAll();
	}

	static async getCardTypeById(id: string) {
		return await CardTypeRepository.findById(id);
	}

	static async updateCardType(id: string, data: Partial<CreateCardTypeInput>) {
		return await CardTypeRepository.update(id, data as any);
	}

	static async deleteCardType(id: string) {
		return await CardTypeRepository.delete(id);
	}
}
