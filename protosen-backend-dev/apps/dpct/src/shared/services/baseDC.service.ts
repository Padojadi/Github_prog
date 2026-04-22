import { IResults } from '../types/common.types';
import { IQueryOptionsDC } from '../../modules/cards/types/card.types';

export interface ICardService<T, C, U> {
	save(data: C): Promise<T>;
	update(id: string, data: U): Promise<T>;
	delete(id: string): Promise<void>;
	getById(id: string): Promise<T>;
	getEntities(queryOptions: IQueryOptionsDC): Promise<IResults<T>>;
	getOne(fields: object): Promise<T>;
}

export abstract class BaseDCService<T, C, U> implements ICardService<T, C, U> {
	abstract repo: any;

	async save(data: C): Promise<T> {
		return await new this.repo().save(data);
	}

	async update(id: string, data: U): Promise<T> {
		return await new this.repo().update(id, data);
	}

	async delete(id: string): Promise<void> {
		return await new this.repo().delete(id);
	}

	async getById(id: string): Promise<T> {
		return await new this.repo().getById(id);
	}

	async getEntities(queryOptions: IQueryOptionsDC): Promise<IResults<T>> {
		return await new this.repo().getAll(queryOptions);
	}

	async getOne(fields: object): Promise<T> {
		return await new this.repo().getOne(fields);
	}

	async hardDelete(id: string) {
		return await new this.repo().hardDelete(id);
	}

	async softDelete(id: string) {
		return await new this.repo().softDelete(id);
	}
}
