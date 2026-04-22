import { Op, WhereOptions } from 'sequelize';
import { HttpStatusCode } from 'axios';
import HttpException from '@shared/errors/HttpException';
import {
	ICreateSpouseDC,
	IQueryOptionsDC,
	IUpdateSpouseDC,
	EDocumentState,
} from '@modules/cards/types';
import { IResults, StatusEnum } from '@shared/types';
import { ERROR_MESSAGE } from '@constants/messages';
import db, {
	OtherDependantDC,
	OtherDependantDCFile,
	Institution,
	RenewOtherDependantDC,
	OwnerDiplomaticCard,
} from '@database/models';

interface IOtherDependantDCRepo {
	save(data: ICreateSpouseDC): Promise<OtherDependantDC>;

	update(id: string, data: IUpdateSpouseDC): Promise<OtherDependantDC | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<OtherDependantDC | null>;

	getAll(queryOptions: IQueryOptionsDC): Promise<IResults<OtherDependantDC>>;

	getOne(fields: object): Promise<OtherDependantDC | null>;
}

export class OtherDependantDCRepo implements IOtherDependantDCRepo {
	async save(data: ICreateSpouseDC): Promise<OtherDependantDC> {
		try {
			return await db.OtherDependantDC.create({
				...data,
				expired: data.expired ?? false,
				status: StatusEnum.ACTIVE,
				documentStage: EDocumentState.ONHOLD,
			} as any);
		} catch  {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async update(id: string, data: IUpdateSpouseDC): Promise<OtherDependantDC | null> {
		try {
			const user = await db.OtherDependantDC.findByPk(id);
			if (!user) {
				throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
			}
			await user.update(data as any);
			return await user.save();
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(ERROR_MESSAGE.UPDATE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async delete(id: string): Promise<void | null> {
		try {
			const user = await db.OtherDependantDC.findByPk(id);
			if (!user) {
				throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
			}
			return await user.destroy();
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new HttpException(ERROR_MESSAGE.DELETE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getById(id: string): Promise<OtherDependantDC | null> {
		try {
			return await OtherDependantDC.findByPk(id, {
				include: [
					{ model: OtherDependantDCFile, as: 'otherDependantDCFiles' },
					{ model: Institution, as: 'organism' },
					{ model: OwnerDiplomaticCard, as: 'ownerDiplomaticCard' },
					{
						model: RenewOtherDependantDC,
						as: 'renewals',
					},
				],
			});
		} catch  {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async getAll(queryOptions: IQueryOptionsDC): Promise<IResults<OtherDependantDC>> {
		try {
			const {
				status,
				search,
				page,
				limit,
				sort = 'desc',
				demandType,
				documentStage,
				organismId,
				ownerCardId,
				creatorId,
				id,
				expired,
			} = queryOptions;
			const offset = (Number(page) - 1) * Number(limit);
			const queryFields: WhereOptions<OtherDependantDC> = {};

			if (search) {
				queryFields.email = { [Op.iLike]: `%${search}%` };
				queryFields.firstName = { [Op.iLike]: `%${search}%` };
				queryFields.lastName = { [Op.iLike]: `%${search}%` };
			}

			if (expired) {
				queryFields.expired = expired === 'true';
			}

			if (status) {
				queryFields.status = status;
			}

			if (demandType) {
				queryFields.demandType = demandType;
			}

			if (documentStage) {
				queryFields.documentStage = { [Op.in]: documentStage };
			}

			if (organismId) {
				queryFields.organismId = organismId;
			}

			if (creatorId) {
				queryFields.creatorId = creatorId;
			}

			if (id) {
				queryFields.id = id;
			}

			if (ownerCardId) {
				queryFields.ownerDiplomaticCardId = ownerCardId;
			}

			const { count, rows } = await db.OtherDependantDC.findAndCountAll({
				limit: Number(limit) * 1 || undefined,
				offset: offset || undefined,
				where: queryFields,
				order: [['createdAt', sort]],
				include: [
					{ model: Institution, as: 'organism' },
					{
						model: RenewOtherDependantDC,
						as: 'renewals',
						attributes: ['id'],
					},
				],
			});
			return { count, rows };
		} catch  {
			throw new HttpException(ERROR_MESSAGE.FETCH_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getOne(fields: object): Promise<OtherDependantDC | null> {
		try {
			return await db.OtherDependantDC.findOne({
				where: { ...fields },
				include: [
					{ model: OtherDependantDCFile, as: 'otherDependantDCFiles' },
					{ model: Institution, as: 'organism' },
					{ model: OwnerDiplomaticCard, as: 'ownerDiplomaticCard' },
					{
						model: RenewOtherDependantDC,
						as: 'renewals',
					},
				],
			});
		} catch  {
			throw new Error(ERROR_MESSAGE.NOT_FOUND_MESSAGE);
		}
	}
}
