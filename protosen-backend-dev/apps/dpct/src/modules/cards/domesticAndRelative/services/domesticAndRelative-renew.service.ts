import { RenewDomesticAndRelativeDC } from 'database/models';
import { RenewDomesticAndRelativeDCRepo } from '../repositories/domesticAndRelative-renew.repository';
import { IResults } from '@shared/types';
import { ICreateRenewSpouseDC, IQueryOptionsDC, IUpdateRenewSpouseDC } from '@modules/cards/types';

export class RenewDomesticAndRelativeDCService {
	async save(data: ICreateRenewSpouseDC): Promise<RenewDomesticAndRelativeDC> {
		return await new RenewDomesticAndRelativeDCRepo().save(data);
	}

	async update(id: string, data: IUpdateRenewSpouseDC): Promise<RenewDomesticAndRelativeDC> {
		return await new RenewDomesticAndRelativeDCRepo().update(id, data);
	}

	async delete(id: string) {
		return await new RenewDomesticAndRelativeDCRepo().delete(id);
	}

	async getById(id: string): Promise<RenewDomesticAndRelativeDC> {
		return await new RenewDomesticAndRelativeDCRepo().getById(id);
	}

	async getDomesticAndRelativeDC(queryOptions: any): Promise<any> {
		return await new RenewDomesticAndRelativeDCRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<RenewDomesticAndRelativeDC> {
		return await new RenewDomesticAndRelativeDCRepo().getOne(field);
	}

	async getEntities(queryOptions: IQueryOptionsDC): Promise<IResults<RenewDomesticAndRelativeDC>> {
		return await new RenewDomesticAndRelativeDCRepo().getAll(queryOptions);
	}
}
