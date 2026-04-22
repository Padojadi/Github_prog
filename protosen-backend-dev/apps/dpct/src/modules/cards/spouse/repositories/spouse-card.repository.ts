import { Op, WhereOptions } from 'sequelize';
import { HttpStatusCode } from 'axios';
import HttpException from '@shared/errors/HttpException';
import db, {
	SpouseDC,
	SpouseDCFile,
	Institution,
	OwnerDiplomaticCard,
	RenewSpouseDC,
} from 'database/models';
import {
	EDocumentState,
	ICreateSpouseDC,
	IQueryOptionsDC,
	IUpdateSpouseDC,
} from '@modules/cards/types';
import { IResults, StatusEnum } from '@shared/types';
import { ERROR_MESSAGE } from '@constants/messages';

interface ISpouseDCRepo {
	save(data: ICreateSpouseDC): Promise<SpouseDC>;

	update(id: string, data: IUpdateSpouseDC): Promise<SpouseDC | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<SpouseDC | null>;

	getAll(queryOptions: IQueryOptionsDC): Promise<IResults<SpouseDC>>;

	getOne(fields: object): Promise<SpouseDC | null>;
}

export class SpouseDCRepo implements ISpouseDCRepo {
	async save(data: ICreateSpouseDC): Promise<SpouseDC> {
		try {
			return await db.SpouseDC.create({
				...data,
				expired: data.expired ?? false,
				status: StatusEnum.ACTIVE,
				documentStage: EDocumentState.ONHOLD,
			} as any);
		} catch  {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async update(id: string, data: IUpdateSpouseDC): Promise<SpouseDC | null> {
		try {
			const user = await db.SpouseDC.findByPk(id);
			if (!user)
				{throw new HttpException("Carte d'epoux/épouse non trouvable", HttpStatusCode.BadRequest);}
			await user.update(data as any);
			return await user.save();
		} catch  {
			throw new HttpException(ERROR_MESSAGE.UPDATE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async delete(id: string): Promise<void | null> {
		try {
			const user = await db.SpouseDC.findByPk(id);
			if (!user)
				{throw new HttpException("Carte d'epoux/épouse non trouvable", HttpStatusCode.BadRequest);}
			return await user.destroy();
		} catch  {
			throw new HttpException(ERROR_MESSAGE.DELETE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getById(id: string): Promise<SpouseDC | null> {
		try {
			return await db.SpouseDC.findByPk(id, {
				include: [
					{ model: SpouseDCFile, as: 'spouseDCFiles' },
					{ model: Institution, as: 'organism' },
					{ model: OwnerDiplomaticCard, as: 'ownerDiplomaticCard' },
				],
			});
		} catch  {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async getAll(queryOptions: IQueryOptionsDC): Promise<IResults<SpouseDC>> {
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
			const queryFields: WhereOptions<SpouseDC> = {};

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

			const { count, rows } = await db.SpouseDC.findAndCountAll({
				limit: Number(limit) * 1 || undefined,
				offset: offset || undefined,
				where: queryFields,
				order: [['createdAt', sort]],
				include: [
					{ model: Institution, as: 'organism' },
					{
						model: RenewSpouseDC,
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

	async getOne(fields: object): Promise<SpouseDC | null> {
		try {
			return await db.SpouseDC.findOne({
				where: { ...fields },
				include: [
					{ model: SpouseDCFile, as: 'spouseDCFiles' },
					{ model: Institution, as: 'organism' },
					{ model: OwnerDiplomaticCard, as: 'ownerDiplomaticCard' },
				],
			});
		} catch  {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}
}
