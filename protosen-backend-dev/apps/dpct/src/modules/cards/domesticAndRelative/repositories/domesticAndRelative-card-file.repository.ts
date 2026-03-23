import { HttpStatusCode } from 'axios';
import HttpException from '@shared/errors/HttpException';
import { ERROR_MESSAGE } from '@constants/messages';
import { FindOptions, InferCreationAttributes } from 'sequelize';
import db, { DomesticAndRelativeDCFile } from '@database/models';
import { IDomesticAndRelativeAddFile } from '@modules/cards/types';

interface IDomesticAndRelativeDCFileRepo {
	save(data: IDomesticAndRelativeAddFile): Promise<DomesticAndRelativeDCFile>;
	findById(id: string): Promise<DomesticAndRelativeDCFile | null>;
	update(id: string, data: Partial<DomesticAndRelativeDCFile>): Promise<DomesticAndRelativeDCFile>;
}

export class DomesticAndRelativeDCFileRepo implements IDomesticAndRelativeDCFileRepo {
	async save(data: IDomesticAndRelativeAddFile): Promise<DomesticAndRelativeDCFile> {
		try {
			return await db.DomesticAndRelativeDCFile.create({
				passportKey: data.passportKey,
				adKey: data.adKey,
				photoKey: data.photoKey ?? '',
				othersKey: data.othersKey ?? [],
				domesticAndRelativeDCId: data.domesticAndRelativeDCId,
			} as InferCreationAttributes<DomesticAndRelativeDCFile>);
		} catch {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getAll(
		field?: FindOptions<DomesticAndRelativeDCFile>,
	): Promise<DomesticAndRelativeDCFile[]> {
		try {
			return await db.DomesticAndRelativeDCFile.findAll(field);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async findById(id: string): Promise<DomesticAndRelativeDCFile | null> {
		try {
			return await db.DomesticAndRelativeDCFile.findByPk(id);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async update(
		id: string,
		data: Partial<DomesticAndRelativeDCFile>,
	): Promise<DomesticAndRelativeDCFile> {
		try {
			const file = await db.DomesticAndRelativeDCFile.findByPk(id);
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
