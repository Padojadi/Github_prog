import { FindOptions } from 'sequelize';
import { DomesticAndRelativeDCFile } from 'database/models';
import { DomesticAndRelativeDCFileRepo } from '../repositories/domesticAndRelative-card-file.repository';
import { IDomesticAndRelativeAddFile } from '@modules/cards/types';

interface IDomesticAndRelativeDCFileService {
	save(data: IDomesticAndRelativeAddFile): Promise<DomesticAndRelativeDCFile>;
}

export class DomesticAndRelativeDCFileService implements IDomesticAndRelativeDCFileService {
	async save(data: IDomesticAndRelativeAddFile): Promise<DomesticAndRelativeDCFile> {
		return await new DomesticAndRelativeDCFileRepo().save(data);
	}

	async getAll(
		field?: FindOptions<DomesticAndRelativeDCFile>,
	): Promise<DomesticAndRelativeDCFile[]> {
		return await new DomesticAndRelativeDCFileRepo().getAll(field);
	}
}
