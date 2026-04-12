import { Model } from 'sequelize';
import { BaseRepository } from '../repositories/base.repository';

/**
 * Service de base générique
 * Fournit les opérations métier communes via le repository
 */
export abstract class BaseService<T extends Model, R extends BaseRepository<T>> {
	protected repository: R;

	constructor(repository: R) {
		this.repository = repository;
	}

	/**
	 * Récupère une entité par son ID
	 */
	async getById(id: string): Promise<T | null> {
		return await this.repository.getById(id);
	}

	/**
	 * Récupère une entité selon des critères
	 */
	async getOne(where: any): Promise<T | null> {
		return await this.repository.getOne(where);
	}

	/**
	 * Crée une nouvelle entité
	 */
	async create(data: any): Promise<T> {
		return await this.repository.create(data);
	}

	/**
	 * Met à jour une entité
	 */
	async update(id: string, data: Partial<T>): Promise<T> {
		return await this.repository.update(id, data);
	}

	/**
	 * Supprime une entité
	 */
	async delete(id: string): Promise<void> {
		return await this.repository.delete(id);
	}
}
