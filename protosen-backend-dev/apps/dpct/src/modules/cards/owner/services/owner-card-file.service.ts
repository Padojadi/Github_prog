import { FindOptions } from 'sequelize';
import { OwnerDiplomaticCardFile } from 'database/models';
import { IOwnerDCFileRepo, OwnerDCFileRepo } from '../repositories/owner-card-file.repository';
import { IOwnerAddFile } from '@modules/cards/types';

interface IOwnerDCFileService extends IOwnerDCFileRepo {}

export class OwnerDCFileService implements IOwnerDCFileService {
	async getById(id: string): Promise<OwnerDiplomaticCardFile | null> {
		return await new OwnerDCFileRepo().getById(id);
	}
	async save(data: IOwnerAddFile): Promise<OwnerDiplomaticCardFile> {
		return await new OwnerDCFileRepo().save(data);
	}

	async getAll(field?: FindOptions<OwnerDiplomaticCardFile>): Promise<OwnerDiplomaticCardFile[]> {
		return await new OwnerDCFileRepo().getAll(field);
	}
}
