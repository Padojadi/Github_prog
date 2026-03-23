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
	ChildDC,
	ChildDCFile,
	Institution,
	RenewChildDC,
	OwnerDiplomaticCard,
} from '@database/models';

interface IChildDCRepo {
	save(data: ICreateSpouseDC): Promise<ChildDC>;

	update(id: string, data: IUpdateSpouseDC): Promise<ChildDC | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<ChildDC | null>;

	getAll(queryOptions: IQueryOptionsDC): Promise<IResults<ChildDC>>;

	getOne(fields: object): Promise<ChildDC | null>;
}

export class ChildDCRepo implements IChildDCRepo {
	async save(data: ICreateSpouseDC): Promise<ChildDC> {
		try {
			return await db.ChildDC.create({
				...data,
				expired: data.expired ?? false,
				status: StatusEnum.ACTIVE,
				documentStage: EDocumentState.ONHOLD,
			} as any);
		} catch {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async update(id: string, data: IUpdateSpouseDC): Promise<ChildDC | null> {
		try {
			const user = await db.ChildDC.findByPk(id);
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
			const user = await db.ChildDC.findByPk(id);
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

	async getById(id: string): Promise<ChildDC | null> {
		try {
			return await ChildDC.findByPk(id, {
				include: [
					{ model: ChildDCFile, as: 'childDCFiles' },
					{ model: Institution, as: 'organism' },
					{ model: OwnerDiplomaticCard, as: 'ownerDiplomaticCard' },
					{
						model: RenewChildDC,
						as: 'renewals',
					},
				],
			});
		} catch (error) {
			console.error("Erreur lors de la récupération de l'utilisateur :", error);
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async getAll(queryOptions: IQueryOptionsDC): Promise<IResults<ChildDC>> {
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
			const queryFields: WhereOptions<ChildDC> = {};

			if (search) {
				queryFields.email = { [Op.iLike]: `%${search}%` };
				queryFields.firstName = { [Op.iLike]: `%${search}%` };
				queryFields.lastName = { [Op.iLike]: `%${search}%` };
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

			if (id) {
				queryFields.id = id;
			}

			if (creatorId) {
				queryFields.creatorId = creatorId;
			}

			if (ownerCardId) {
				queryFields.ownerDiplomaticCardId = ownerCardId;
			}

			const { count, rows } = await db.ChildDC.findAndCountAll({
				limit: Number(limit) * 1 || undefined,
				offset: offset || undefined,
				where: queryFields,
				order: [['createdAt', sort]],
				include: [
					{ model: Institution, as: 'organism' },
					{
						model: RenewChildDC,
						as: 'renewals',
						attributes: ['id'],
					},
				],
			});

			return { count, rows };
		} catch (error) {
			console.error('Erreur lors de la récupération des données :', error);
			throw new HttpException(ERROR_MESSAGE.FETCH_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getOne(fields: object): Promise<ChildDC | null> {
		try {
			return await db.ChildDC.findOne({
				where: { ...fields },
				include: [
					{ model: ChildDCFile, as: 'childDCFiles' },
					{ model: Institution, as: 'organism' },
					{ model: OwnerDiplomaticCard, as: 'ownerDiplomaticCard' },
					{
						model: RenewChildDC,
						as: 'renewals',
					},
				],
			});
		} catch {
			throw new Error(ERROR_MESSAGE.NOT_FOUND_MESSAGE);
		}
	}
}
