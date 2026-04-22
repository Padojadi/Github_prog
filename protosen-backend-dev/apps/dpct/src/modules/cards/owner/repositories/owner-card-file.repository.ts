import { HttpStatusCode } from 'axios';
import HttpException from '../../../../shared/errors/HttpException';
import { FindOptions, InferCreationAttributes } from 'sequelize';
import db, { OwnerDiplomaticCardFile, OwnerDiplomaticCard } from 'database/models';
import { IOwnerAddFile } from '@modules/cards/types';
import { ERROR_MESSAGE } from '@constants/messages';

export interface IOwnerDCFileRepo {
	save(data: IOwnerAddFile): Promise<OwnerDiplomaticCardFile>;
	getById(id: string): Promise<OwnerDiplomaticCardFile | null>;
}

export class OwnerDCFileRepo implements IOwnerDCFileRepo {
	async save(data: IOwnerAddFile): Promise<OwnerDiplomaticCardFile> {
		try {
			return await db.OwnerDiplomaticCardFile.create({
				passportKey: data.passportKey,
				lcKey: data.lcKey,
				photoKey: data.photoKey ?? '',
				othersKey: data.othersKey ?? [],
				ownerDiplomaticCardId: data.ownerDiplomaticCardId,
			} as InferCreationAttributes<OwnerDiplomaticCardFile>);
		} catch  {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getById(id: string): Promise<OwnerDiplomaticCardFile | null> {
		try {
			return await db.OwnerDiplomaticCardFile.findByPk(id, {
				include: [OwnerDiplomaticCard],
			});
		} catch  {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async getAll(field?: FindOptions<OwnerDiplomaticCardFile>): Promise<OwnerDiplomaticCardFile[]> {
		try {
			return await db.OwnerDiplomaticCardFile.findAll(field);
		} catch  {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async findById(id: string): Promise<OwnerDiplomaticCardFile | null> {
		try {
			return await db.OwnerDiplomaticCardFile.findByPk(id);
		} catch  {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async update(
		id: string,
		data: Partial<OwnerDiplomaticCardFile>,
	): Promise<OwnerDiplomaticCardFile> {
		try {
			const file = await db.OwnerDiplomaticCardFile.findByPk(id);
			if (!file) {
				throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
			}
			await file.update(data);
			return file;
		} catch (error: any) {
			if (error instanceof HttpException) {throw error;}
			throw new HttpException(ERROR_MESSAGE.UPDATE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}
}
