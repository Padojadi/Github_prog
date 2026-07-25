import { RenewSpouseDC } from 'database/models';
import { RenewSpouseDCRepo } from '../repositories/spouse-renew.repository';
import { ICreateRenewSpouseDC, IQueryOptionsDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { IResults } from '@shared/types';

export class RenewSpouseDCService {
	async save(data: ICreateRenewSpouseDC): Promise<RenewSpouseDC> {
		return await new RenewSpouseDCRepo().save(data);
	}

	async update(id: string, data: IUpdateRenewSpouseDC): Promise<RenewSpouseDC> {
		return await new RenewSpouseDCRepo().update(id, data);
	}

	async delete(id: string) {
		return await new RenewSpouseDCRepo().delete(id);
	}

	async getById(id: string): Promise<RenewSpouseDC> {
		return await new RenewSpouseDCRepo().getById(id);
	}

	async getSpouseDC(queryOptions: any): Promise<any> {
		return await new RenewSpouseDCRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<RenewSpouseDC> {
		return await new RenewSpouseDCRepo().getOne(field);
	}

	async getEntities(queryOptions: IQueryOptionsDC): Promise<IResults<RenewSpouseDC>> {
		return await new RenewSpouseDCRepo().getAll(queryOptions);
	}
}
