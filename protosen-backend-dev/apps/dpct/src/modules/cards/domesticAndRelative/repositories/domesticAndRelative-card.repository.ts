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
	DomesticAndRelativeDC,
	DomesticAndRelativeDCFile,
	Institution,
	OwnerDiplomaticCard,
	RenewDomesticAndRelativeDC,
} from '@database/models';

interface IDomesticAndRelativeDCRepo {
	save(data: ICreateSpouseDC): Promise<DomesticAndRelativeDC>;

	update(id: string, data: IUpdateSpouseDC): Promise<DomesticAndRelativeDC | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<DomesticAndRelativeDC | null>;

	getAll(queryOptions: IQueryOptionsDC): Promise<IResults<DomesticAndRelativeDC>>;

	getOne(fields: object): Promise<DomesticAndRelativeDC | null>;
}

export class DomesticAndRelativeDCRepo implements IDomesticAndRelativeDCRepo {
	async save(data: ICreateSpouseDC): Promise<DomesticAndRelativeDC> {
		try {
			return await db.DomesticAndRelativeDC.create({
				...data,
				expired: data.expired ?? false,
				status: StatusEnum.ACTIVE,
				documentStage: EDocumentState.ONHOLD,
			} as any);
		} catch {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async update(id: string, data: IUpdateSpouseDC): Promise<DomesticAndRelativeDC | null> {
		try {
			const user = await db.DomesticAndRelativeDC.findByPk(id);
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
			const user = await db.DomesticAndRelativeDC.findByPk(id);
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

	async getById(id: string): Promise<DomesticAndRelativeDC | null> {
		try {
			return await DomesticAndRelativeDC.findByPk(id, {
				include: [
					{ model: DomesticAndRelativeDCFile, as: 'domesticAndRelativeDCFiles' },
					{ model: Institution, as: 'organism' },
					{ model: OwnerDiplomaticCard, as: 'ownerDiplomaticCard' },
					{
						model: RenewDomesticAndRelativeDC,
						as: 'renewals',
					},
				],
			});
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async getAll(queryOptions: IQueryOptionsDC): Promise<IResults<DomesticAndRelativeDC>> {
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
				creatorId,
				ownerCardId,
				id,
				expired,
			} = queryOptions;
			const offset = (Number(page) - 1) * Number(limit);
			const queryFields: WhereOptions<DomesticAndRelativeDC> = {};

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

			const { count, rows } = await db.DomesticAndRelativeDC.findAndCountAll({
				limit: Number(limit) * 1 || undefined,
				offset: offset || undefined,
				where: queryFields,
				order: [['createdAt', sort]],
				include: [
					{ model: Institution, as: 'organism' },
					{
						model: RenewDomesticAndRelativeDC,
						as: 'renewals',
						attributes: ['id'],
					},
				],
			});
			return { count, rows };
		} catch {
			throw new HttpException(ERROR_MESSAGE.FETCH_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getOne(fields: object): Promise<DomesticAndRelativeDC | null> {
		try {
			return await db.DomesticAndRelativeDC.findOne({
				where: { ...fields },
				include: [
					{ model: DomesticAndRelativeDCFile, as: 'domesticAndRelativeDCFiles' },
					{ model: Institution, as: 'organism' },
					{ model: OwnerDiplomaticCard, as: 'ownerDiplomaticCard' },
				],
			});
		} catch {
			throw new Error(ERROR_MESSAGE.NOT_FOUND_MESSAGE);
		}
	}
}
