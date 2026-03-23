import { RenewOwnerDC } from 'database/models';
import { RenewOwnerDCRepo } from '../repositories/owner-renew.repository';
import { ICreateRenewOwnerDC, IQueryOptionsDC, IUpdateRenewOwnerDC } from '@modules/cards/types';
import { IResults } from '@shared/types';

interface IRenewOwnerDCService {
	save(data: ICreateRenewOwnerDC): Promise<RenewOwnerDC>;

	update(id: string, data: IUpdateRenewOwnerDC): Promise<RenewOwnerDC>;

	delete(id: string): Promise<void>;

	getById(id: string): Promise<RenewOwnerDC>;

	getOwnersDC(queryOptions: IQueryOptionsDC): Promise<IResults<RenewOwnerDC>>;

	getOne(fields: object): Promise<RenewOwnerDC>;
}

export class RenewOwnerDCService implements IRenewOwnerDCService {
	async save(data: ICreateRenewOwnerDC): Promise<RenewOwnerDC> {
		return await new RenewOwnerDCRepo().save(data);
	}

	async update(id: string, data: IUpdateRenewOwnerDC): Promise<RenewOwnerDC> {
		return await new RenewOwnerDCRepo().update(id, data);
	}

	async delete(id: string) {
		return await new RenewOwnerDCRepo().delete(id);
	}

	async getById(id: string): Promise<RenewOwnerDC> {
		return await new RenewOwnerDCRepo().getById(id);
	}

	async getOwnersDC(queryOptions: IQueryOptionsDC): Promise<IResults<RenewOwnerDC>> {
		return await new RenewOwnerDCRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<RenewOwnerDC> {
		return await new RenewOwnerDCRepo().getOne(field);
	}
}
