import { FindOptions } from 'sequelize';
import { OtherStaffDCFile } from 'database/models';
import { OtherStaffDCFileRepo } from '../repositories/otherStaff-card-file.repository';
import { IOtherStaffAddFile } from '@modules/cards/types';

interface IOtherStaffDCFileService {
	save(data: IOtherStaffAddFile): Promise<OtherStaffDCFile>;
}

export class OtherStaffDCFileService implements IOtherStaffDCFileService {
	async save(data: IOtherStaffAddFile): Promise<OtherStaffDCFile> {
		return await new OtherStaffDCFileRepo().save(data);
	}

	async getAll(field?: FindOptions<OtherStaffDCFile>): Promise<OtherStaffDCFile[]> {
		return await new OtherStaffDCFileRepo().getAll(field);
	}
}
