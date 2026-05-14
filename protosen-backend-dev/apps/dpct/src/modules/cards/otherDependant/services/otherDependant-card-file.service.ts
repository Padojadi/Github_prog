import { FindOptions } from 'sequelize';
import { OtherDependantDCFile } from '@database/models';
import { OtherDependantDCFileRepo } from '../repositories/otherDependant-card-file.repository';
import { IOtherDependnatAddFile } from '@modules/cards/types';

interface IOtherDependantDCFileService {
	save(data: IOtherDependnatAddFile): Promise<OtherDependantDCFile>;
}

export class OtherDependantDCFileService implements IOtherDependantDCFileService {
	async save(data: IOtherDependnatAddFile): Promise<OtherDependantDCFile> {
		return await new OtherDependantDCFileRepo().save(data);
	}

	async getAll(field?: FindOptions<OtherDependantDCFile>): Promise<OtherDependantDCFile[]> {
		return await new OtherDependantDCFileRepo().getAll(field);
	}
}
