import { HttpStatusCode } from 'axios';
import HttpException from '@shared/errors/HttpException';
import { FindOptions, InferCreationAttributes } from 'sequelize';
import db, { ChildDCFile } from '@database/models';
import { IChildAddFile } from '@modules/cards/types';
import { ERROR_MESSAGE } from '@constants/messages';

interface IChildDCFileRepo {
	save(data: IChildAddFile): Promise<ChildDCFile>;
	findById(id: string): Promise<ChildDCFile | null>;
	update(id: string, data: Partial<ChildDCFile>): Promise<ChildDCFile>;
}

export class ChildDCFileRepo implements IChildDCFileRepo {
	async save(data: IChildAddFile): Promise<ChildDCFile> {
		try {
			return await db.ChildDCFile.create({
				passportKey: data.passportKey,
				anKey: data.anKey,
				photoKey: data.photoKey ?? '',
				othersKey: data.othersKey ?? [],
				childDCId: data.childDCId,
			} as InferCreationAttributes<ChildDCFile>);
		} catch {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getAll(field?: FindOptions<ChildDCFile>): Promise<ChildDCFile[]> {
		try {
			return await db.ChildDCFile.findAll(field);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async findById(id: string): Promise<ChildDCFile | null> {
		try {
			return await db.ChildDCFile.findByPk(id);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async update(id: string, data: Partial<ChildDCFile>): Promise<ChildDCFile> {
		try {
			const file = await db.ChildDCFile.findByPk(id);
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
