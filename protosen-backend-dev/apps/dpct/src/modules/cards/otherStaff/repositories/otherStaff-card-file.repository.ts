import { HttpStatusCode } from 'axios';
import HttpException from '@shared/errors/HttpException';
import { FindOptions, InferCreationAttributes } from 'sequelize';
import db, { OtherStaffDCFile } from 'database/models';
import { IOtherStaffAddFile } from '@modules/cards/types';
import { ERROR_MESSAGE } from '@constants/messages';

interface IOtherStaffDCFileRepo {
	save(data: IOtherStaffAddFile): Promise<OtherStaffDCFile>;
}

export class OtherStaffDCFileRepo implements IOtherStaffDCFileRepo {
	async save(data: IOtherStaffAddFile): Promise<OtherStaffDCFile> {
		try {
			return await db.OtherStaffDCFile.create({
				passportKey: data.passportKey,
				adKey: data.adKey,
				photoKey: data.photoKey ?? '',
				othersKey: data.othersKey ?? [],
				otherStaffDCId: data.otherStaffDCId,
			} as InferCreationAttributes<OtherStaffDCFile>);
		} catch {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getAll(field?: FindOptions<OtherStaffDCFile>): Promise<OtherStaffDCFile[]> {
		try {
			return await db.OtherStaffDCFile.findAll(field);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async findById(id: string): Promise<OtherStaffDCFile | null> {
		try {
			return await db.OtherStaffDCFile.findByPk(id);
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async update(id: string, data: Partial<OtherStaffDCFile>): Promise<OtherStaffDCFile> {
		try {
			const file = await db.OtherStaffDCFile.findByPk(id);
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
