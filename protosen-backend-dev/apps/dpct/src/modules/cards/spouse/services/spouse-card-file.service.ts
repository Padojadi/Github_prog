import { FindOptions } from 'sequelize';
import { SpouseDCFile } from 'database/models';
import { SpouseDCFileRepo } from '../repositories/spouse-card-file.repository';
import { ISpouseAddFile } from '@modules/cards/types';

interface ISpouseDCFileService {
	save(data: ISpouseAddFile): Promise<SpouseDCFile>;
}

export class SpouseDCFileService implements ISpouseDCFileService {
	async save(data: ISpouseAddFile): Promise<SpouseDCFile> {
		return await new SpouseDCFileRepo().save(data);
	}

	async getAll(field?: FindOptions<SpouseDCFile>): Promise<SpouseDCFile[]> {
		return await new SpouseDCFileRepo().getAll(field);
	}
}
