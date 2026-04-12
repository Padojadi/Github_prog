import { Op } from 'sequelize';
import { HttpStatusCode } from 'axios';
import HttpException from '../../../../shared/errors/HttpException';
import db, { OwnerDiplomaticCardFile, OwnerDiplomaticCard, Institution } from 'database/models';
import { RenewOwnerDC } from 'database/models';
import {
	EDocumentState,
	ICreateOwnerDC,
	IQueryOptionsDC,
	IUpdateOwnerDC,
} from '@modules/cards/types';
import { IResults, StatusEnum } from '@shared/types';
import { ERROR_MESSAGE } from '@constants/messages';
import { AUTH_MESSAGES } from '@constants/index';

interface IOwnerDCRepo {
	save(data: ICreateOwnerDC): Promise<OwnerDiplomaticCard>;

	update(id: string, data: IUpdateOwnerDC): Promise<OwnerDiplomaticCard | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<OwnerDiplomaticCard | null>;

	getAll(queryOptions: IQueryOptionsDC): Promise<IResults<OwnerDiplomaticCard>>;

	getOne(fields: object): Promise<OwnerDiplomaticCard | null>;
}

export class OwnerDCRepo implements IOwnerDCRepo {
	async save(data: ICreateOwnerDC): Promise<OwnerDiplomaticCard> {
		try {
			return await db.OwnerDiplomaticCard.create({
				...data,
				expired: data.expired ?? false,
				status: StatusEnum.ACTIVE,
				documentStage: EDocumentState.ONHOLD,
			} as any);
		} catch {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async update(id: string, data: IUpdateOwnerDC): Promise<OwnerDiplomaticCard | null> {
		try {
			const user = await db.OwnerDiplomaticCard.findByPk(id);
			if (!user) {
				throw new HttpException(AUTH_MESSAGES.ACCOUNT_NOT_FOUND, HttpStatusCode.NotFound);
			}
			if (user.cardNumber) {
				delete data.cardNumber;
			}
			await user.update(data as any);
			return await user.save();
		} catch (error) {
			console.error('Error updating OwnerDiplomaticCard:', error);
			throw new HttpException(ERROR_MESSAGE.UPDATE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async delete(id: string): Promise<void | null> {
		try {
			const user = await db.OwnerDiplomaticCard.findByPk(id);
			if (!user) {
				throw new HttpException(AUTH_MESSAGES.ACCOUNT_NOT_FOUND, HttpStatusCode.NotFound);
			}
			return await user.destroy();
		} catch {
			throw new HttpException(ERROR_MESSAGE.DELETE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getById(id: string): Promise<OwnerDiplomaticCard | null> {
		try {
			return await db.OwnerDiplomaticCard.findByPk(id, {
				include: [
					{ model: OwnerDiplomaticCardFile, as: 'ownerDiplomaticCardFiles' },
					{ model: Institution, as: 'organism' },
					{
						model: RenewOwnerDC,
						as: 'renewals',
					},
				],
			});
		} catch (error) {
			console.error('Error fetching OwnerDiplomaticCard by ID:', error);
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async getAll(queryOptions: IQueryOptionsDC): Promise<IResults<OwnerDiplomaticCard>> {
		try {
			const {
				status,
				search,
				page,
				limit,
				sort = 'desc',
				documentStage,
				organismId,
				creatorId,
				id,
				expired,
			} = queryOptions;
			const offset = (Number(page) - 1) * Number(limit);
			const queryFields: any = {};

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

			const { count, rows } = await db.OwnerDiplomaticCard.findAndCountAll({
				limit: Number(limit) || undefined,
				offset: offset || undefined,
				where: { ...queryFields },
				order: [['createdAt', sort]],
				include: [
					{ model: Institution, as: 'organism' },
					{
						model: RenewOwnerDC,
						as: 'renewals',
						attributes: ['id'],
					},
				],
			});
			return { count, rows };
		} catch (error) {
			console.error(error);
			throw new HttpException(ERROR_MESSAGE.FETCH_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getOne(fields: object): Promise<OwnerDiplomaticCard | null> {
		try {
			return await db.OwnerDiplomaticCard.findOne({
				where: { ...fields },
				include: [
					{ model: OwnerDiplomaticCardFile, as: 'ownerDiplomaticCardFiles' },
					{ model: Institution, as: 'organism' },
				],
			});
		} catch {
			throw new Error(ERROR_MESSAGE.NOT_FOUND_MESSAGE);
		}
	}
}
