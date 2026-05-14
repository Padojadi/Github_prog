import { HttpStatusCode } from 'axios';
import HttpException from '@shared/errors/HttpException';
import { FindOptions, InferCreationAttributes } from 'sequelize';
import db, { SpouseDCFile } from '@database/models';
import { ISpouseAddFile } from '@modules/cards/types';
import { ERROR_MESSAGE } from '@constants/messages';

interface ISpouseDCFileRepo {
	save(data: ISpouseAddFile): Promise<SpouseDCFile>;
}

export class SpouseDCFileRepo implements ISpouseDCFileRepo {
	async save(data: ISpouseAddFile): Promise<SpouseDCFile> {
		try {
			return await db.SpouseDCFile.create({
				passportKey: data.passportKey,
				amKey: data.amKey,
				photoKey: data.photoKey ?? '',
				othersKey: data.othersKey ?? [],
				spouseDCId: data.spouseDCId,
			} as InferCreationAttributes<SpouseDCFile>);
		} catch {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getAll(field?: FindOptions<SpouseDCFile>): Promise<SpouseDCFile[]> {
		try {
			return await db.SpouseDCFile.findAll(field);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async findById(id: string): Promise<SpouseDCFile | null> {
		try {
			return await db.SpouseDCFile.findByPk(id);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async update(id: string, data: Partial<SpouseDCFile>): Promise<SpouseDCFile> {
		try {
			const file = await db.SpouseDCFile.findByPk(id);
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
