import { FindOptions } from 'sequelize';
import { ChildDCFile } from 'database/models';
import { ChildDCFileRepo } from '../repositories/child-card-file.repository';
import { IChildAddFile } from '@modules/cards/types';

interface IChildDCFileService {
	save(data: IChildAddFile): Promise<ChildDCFile>;
}

export class ChildDCFileService implements IChildDCFileService {
	async save(data: IChildAddFile): Promise<ChildDCFile> {
		return await new ChildDCFileRepo().save(data);
	}

	async getAll(field?: FindOptions<ChildDCFile>): Promise<ChildDCFile[]> {
		return await new ChildDCFileRepo().getAll(field);
	}
}
