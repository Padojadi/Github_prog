import { FindOptions, Model, ModelStatic, WhereOptions } from 'sequelize';
import HttpException from '../errors/HttpException';
import { HttpStatusCode } from 'axios';
import { ERROR_MESSAGE } from 'src/constants/messages';

/**
 * Repository de base générique pour toutes les entités
 * Fournit les opérations CRUD communes
 */
export abstract class BaseRepository<T extends Model> {
	protected model: ModelStatic<T>;

	constructor(model: ModelStatic<T>) {
		this.model = model;
	}

	/**
	 * Récupère une entité par son ID
	 */
	async getById(id: string, options?: FindOptions<T>): Promise<T | null> {
		try {
			return await this.model.findByPk(id, options);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	/**
	 * Récupère une entité selon des critères
	 */
	async getOne(where: WhereOptions<T>, options?: FindOptions<T>): Promise<T | null> {
		try {
			return await this.model.findOne({
				where,
				...options,
			});
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	/**
	 * Récupère toutes les entités selon des critères
	 */
	async getAll(options?: FindOptions<T>): Promise<T[]> {
		try {
			return await this.model.findAll(options);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	/**
	 * Crée une nouvelle entité
	 */
	async create(data: Partial<T>): Promise<T> {
		try {
			return await this.model.create(data as T['_creationAttributes']);
		} catch {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	/**
	 * Met à jour une entité
	 */
	async update(id: string, data: Partial<T>): Promise<T> {
		try {
			const entity = await this.getById(id);
			if (!entity) {
				throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
			}
			await entity.update(data as T['_creationAttributes']);
			return entity;
		} catch (error) {
			if (error instanceof HttpException) {throw error;}
			throw new HttpException(ERROR_MESSAGE.UPDATE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	/**
	 * Supprime une entité
	 */
	async delete(id: string): Promise<void> {
		try {
			const entity = await this.getById(id);
			if (!entity) {
				throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
			}
			await entity.destroy();
		} catch (error) {
			if (error instanceof HttpException) {throw error;}
			throw new HttpException(ERROR_MESSAGE.DELETE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	/**
	 * Compte le nombre d'entités selon des critères
	 */
	async count(options?: FindOptions<T>): Promise<number> {
		try {
			return await this.model.count(options);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.BadRequest);
		}
	}
}
