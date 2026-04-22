import { RenewOtherStaffDC } from 'database/models';
import { RenewOtherStaffDCRepo } from '../repositories/otherStaff-renew.repository';
import { ICreateRenewSpouseDC, IQueryOptionsDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { IResults } from '@shared/types';

export class RenewOtherStaffDCService {
	async save(data: ICreateRenewSpouseDC): Promise<RenewOtherStaffDC> {
		return await new RenewOtherStaffDCRepo().save(data);
	}

	async update(id: string, data: IUpdateRenewSpouseDC): Promise<RenewOtherStaffDC> {
		return await new RenewOtherStaffDCRepo().update(id, data);
	}

	async delete(id: string) {
		return await new RenewOtherStaffDCRepo().delete(id);
	}

	async getById(id: string): Promise<RenewOtherStaffDC> {
		return await new RenewOtherStaffDCRepo().getById(id);
	}

	async getOtherStaffDC(queryOptions: any): Promise<any> {
		return await new RenewOtherStaffDCRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<RenewOtherStaffDC> {
		return await new RenewOtherStaffDCRepo().getOne(field);
	}

	async getEntities(queryOptions: IQueryOptionsDC): Promise<IResults<RenewOtherStaffDC>> {
		return await new RenewOtherStaffDCRepo().getAll(queryOptions);
	}
}
