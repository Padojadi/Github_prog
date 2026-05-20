import { RenewChildDC } from 'database/models';
import { RenewChildDCRepo } from '../repositories/child-renew.repository';
import { ICreateRenewSpouseDC, IQueryOptionsDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { IResults } from '@shared/types';

export class RenewChildDCService {
	async save(data: ICreateRenewSpouseDC): Promise<RenewChildDC> {
		return await new RenewChildDCRepo().save(data);
	}

	async update(id: string, data: IUpdateRenewSpouseDC): Promise<RenewChildDC> {
		return await new RenewChildDCRepo().update(id, data);
	}

	async delete(id: string) {
		return await new RenewChildDCRepo().delete(id);
	}

	async getById(id: string): Promise<RenewChildDC> {
		return await new RenewChildDCRepo().getById(id);
	}

	async getChildrenDC(queryOptions: any): Promise<any> {
		return await new RenewChildDCRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<RenewChildDC> {
		return await new RenewChildDCRepo().getOne(field);
	}

	async getEntities(queryOptions: IQueryOptionsDC): Promise<IResults<RenewChildDC>> {
		return await new RenewChildDCRepo().getAll(queryOptions);
	}
}
