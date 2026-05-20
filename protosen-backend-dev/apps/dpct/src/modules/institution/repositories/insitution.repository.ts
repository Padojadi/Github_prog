import { Op } from 'sequelize';
import HttpException from '../../../shared/errors/HttpException';
import { HttpStatusCode } from 'axios';
import db, { Institution } from 'database/models';
import { CreateInstitutionInput } from '../dtos/institution.dto';
import { IInstitutionQueryOptions } from '../types';
import { IResults, StrictStatusEnum } from '@shared/types';
import { ERROR_MESSAGE } from '@constants/messages';

export interface IInstitutionsRepo {
	save(data: Institution): Promise<Institution>;

	update(id: string, data: Partial<Institution>): Promise<Institution | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<Institution | null>;

	getByIds(ids: string[]): Promise<Institution[]>;

	getAll(queryOptions: IInstitutionQueryOptions): Promise<IResults<Institution>>;

	getOne(fields: object): Promise<Institution | null>;
}

export class InstitutionsRepo implements IInstitutionsRepo {
	async save(data: CreateInstitutionInput): Promise<Institution> {
		try {
			return await db.Institution.create({
				institutionType: data.institutionType,
				code: data.code,
				libelle: data.libelle,
				service: data.service ?? '',
				status: data.status ?? StrictStatusEnum.ACTIVE,
			});
		} catch  {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async update(id: string, data: Partial<Institution>): Promise<Institution | null> {
		try {
			const institution = await db.Institution.findByPk(id);
			if (!institution) {
				throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
			}
			await institution.update(data);
			return await institution.save();
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(ERROR_MESSAGE.UPDATE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async delete(id: string): Promise<void | null> {
		try {
			const institution = await db.Institution.findByPk(id);
			if (!institution) {
				throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
			}
			return await institution.destroy();
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(ERROR_MESSAGE.DELETE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getById(id: string): Promise<Institution | null> {
		try {
			return await Institution.findByPk(id);
		} catch  {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async getAll(queryOptions: IInstitutionQueryOptions): Promise<IResults<Institution>> {
		try {
			const { status, search, page, limit, sort = 'desc', code, institutionType } = queryOptions;
			const offset = (Number(page) - 1) * Number(limit);
			let queryFields: any = {};

			if (search) {
				queryFields = {
					[Op.or]: [
						{ libelle: { [Op.iLike]: `%${search}%` } },
						{ service: { [Op.iLike]: `%${search}%` } },
					],
				};
			}
			if (status) {
				queryFields.status = status;
			}
			if (code) {
				queryFields.code = code.toUpperCase();
			}
			if (institutionType) {
				queryFields.institutionType = institutionType.toUpperCase();
			}
			const { count, rows } = await db.Institution.findAndCountAll({
				limit: Number(limit) * 1 || undefined,
				offset: offset || undefined,
				where: queryFields,
				order: [['createdAt', sort]],
			});
			return { count, rows };
		} catch  {
			throw new Error(ERROR_MESSAGE.FETCH_FAILURE_MESSAGE);
		}
	}

	async getOne(fields: object): Promise<Institution | null> {
		try {
			return await db.Institution.findOne({
				where: { ...fields },
			});
		} catch  {
			throw new Error(ERROR_MESSAGE.NOT_FOUND_MESSAGE);
		}
	}

	async getByIds(ids: string[]): Promise<Institution[]> {
		try {
			return await db.Institution.findAll({
				where: {
					id: {
						[Op.in]: ids,
					},
				},
			});
		} catch  {
			throw new Error(ERROR_MESSAGE.FETCH_FAILURE_MESSAGE);
		}
	}
}
