import { RenewOtherDependantDC } from 'database/models';
import { RenewOtherDependantDCRepo } from '../repositories/otherDependant-renew.repository';
import { ICreateRenewSpouseDC, IQueryOptionsDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { IResults } from '@shared/types';

export class RenewOtherDependantDCService {
	async save(data: ICreateRenewSpouseDC): Promise<RenewOtherDependantDC> {
		return await new RenewOtherDependantDCRepo().save(data);
	}

	async update(id: string, data: IUpdateRenewSpouseDC): Promise<RenewOtherDependantDC> {
		return await new RenewOtherDependantDCRepo().update(id, data);
	}

	async delete(id: string) {
		return await new RenewOtherDependantDCRepo().delete(id);
	}

	async getById(id: string): Promise<RenewOtherDependantDC> {
		return await new RenewOtherDependantDCRepo().getById(id);
	}

	async getOtherDependantDC(queryOptions: any): Promise<any> {
		return await new RenewOtherDependantDCRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<RenewOtherDependantDC> {
		return await new RenewOtherDependantDCRepo().getOne(field);
	}

	async getEntities(queryOptions: IQueryOptionsDC): Promise<IResults<RenewOtherDependantDC>> {
		return await new RenewOtherDependantDCRepo().getAll(queryOptions);
	}
}
