import { PlaqueRepository } from '../repositories/plaque.repository';
import { CreatePlaqueInput } from '../dtos/plaque.dto';

export class PlaqueService {
	static async createPlaque(data: CreatePlaqueInput) {
		return await PlaqueRepository.create(data as any);
	}

	static async getAllPlaques() {
		return await PlaqueRepository.findAll();
	}

	static async getPlaqueById(id: string) {
		return await PlaqueRepository.findById(id);
	}

	static async updatePlaque(id: string, data: Partial<CreatePlaqueInput>) {
		return await PlaqueRepository.update(id, data as any);
	}

	static async deletePlaque(id: string) {
		return await PlaqueRepository.delete(id);
	}
}
