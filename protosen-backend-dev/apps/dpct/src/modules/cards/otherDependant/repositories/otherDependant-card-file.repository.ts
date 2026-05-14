import { HttpStatusCode } from 'axios';
import HttpException from '@shared/errors/HttpException';
import { ERROR_MESSAGE } from '@constants/messages';
import { IOtherDependnatAddFile } from '@modules/cards/types';
import { FindOptions, InferCreationAttributes } from 'sequelize';
import db, { OtherDependantDCFile } from '@database/models';

interface IOtherDependantDCFileRepo {
	save(data: IOtherDependnatAddFile): Promise<OtherDependantDCFile>;
}

export class OtherDependantDCFileRepo implements IOtherDependantDCFileRepo {
	async save(data: IOtherDependnatAddFile): Promise<OtherDependantDCFile> {
		try {
			return await db.OtherDependantDCFile.create({
				passportKey: data.passportKey,
				adKey: data.adKey,
				photoKey: data.photoKey ?? '',
				othersKey: data.othersKey ?? [],
				otherDependantDCId: data.otherDependantDCId,
			} as InferCreationAttributes<OtherDependantDCFile>);
		} catch {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getAll(field?: FindOptions<OtherDependantDCFile>): Promise<OtherDependantDCFile[]> {
		try {
			return await db.OtherDependantDCFile.findAll(field);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async findById(id: string): Promise<OtherDependantDCFile | null> {
		try {
			return await db.OtherDependantDCFile.findByPk(id);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async update(id: string, data: Partial<OtherDependantDCFile>): Promise<OtherDependantDCFile> {
		try {
			const file = await db.OtherDependantDCFile.findByPk(id);
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
