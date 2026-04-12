import { Op } from 'sequelize';
import { HttpStatusCode } from 'axios';

import HttpException from '../../../../shared/errors/HttpException';
import db, { RenewOwnerDC, OwnerDiplomaticCard } from 'database/models';
import { ICreateRenewOwnerDC, IQueryOptionsDC, IUpdateRenewOwnerDC } from '@modules/cards/types';
import { IResults } from '@shared/types';
import { ERROR_MESSAGE } from '@constants/messages';

interface IRenewOwnerDCRepo {
	save(data: ICreateRenewOwnerDC): Promise<RenewOwnerDC>;

	update(id: string, data: IUpdateRenewOwnerDC): Promise<RenewOwnerDC>;

	delete(id: string): Promise<void>;

	getById(id: string): Promise<RenewOwnerDC>;

	getAll(queryOptions: IQueryOptionsDC): Promise<IResults<RenewOwnerDC>>;

	getOne(fields: object): Promise<RenewOwnerDC>;
}

export class RenewOwnerDCRepo implements IRenewOwnerDCRepo {
	async save(data: ICreateRenewOwnerDC): Promise<RenewOwnerDC> {
		try {
			return await db.RenewOwnerDC.create({ ...data } as any);
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.CREATION_FAILURE_MESSAGE,
				HttpStatusCode.BadRequest,
				error.message,
			);
		}
	}

	async update(id: string, data: IUpdateRenewOwnerDC): Promise<RenewOwnerDC> {
		try {
			const user = await db.RenewOwnerDC.findByPk(id);
			if (!user) {
				throw new HttpException('Non toruvable', HttpStatusCode.NotFound);
			}
			await user.update(data as any);
			return await user.save();
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.UPDATE_FAILURE_MESSAGE,
				HttpStatusCode.BadRequest,
				error.message,
			);
		}
	}

	async delete(id: string): Promise<void> {
		try {
			const ownerdc = await db.RenewOwnerDC.findByPk(id);
			if (!ownerdc) {
				throw new HttpException('Non toruvable', HttpStatusCode.NotFound);
			}
			return await ownerdc.destroy();
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.DELETE_FAILURE_MESSAGE,
				HttpStatusCode.BadRequest,
				error.message,
			);
		}
	}

	async getById(id: string): Promise<RenewOwnerDC> {
		try {
			const ownerdc = await db.RenewOwnerDC.findByPk(id, {
				include: [
					{
						model: OwnerDiplomaticCard,
						as: 'previousCard',
						include: [
							{
								model: db.OwnerDiplomaticCardFile,
								as: 'ownerDiplomaticCardFiles',
							},
							{
								model: db.Institution,
								as: 'organism',
							},
						],
					},
				],
			});
			if (!ownerdc) {
				throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
			}
			return ownerdc;
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.FETCH_FAILURE_MESSAGE,
				HttpStatusCode.NotFound,
				error.message,
			);
		}
	}

	async getAll(queryOptions: IQueryOptionsDC): Promise<IResults<RenewOwnerDC>> {
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
				queryFields.documentStage = documentStage;
			}

			const include = [
				{
					model: OwnerDiplomaticCard,
					as: 'previousCard',
					include: [
						{
							model: db.Institution,
							as: 'organism',
						},
						{
							model: db.OwnerDiplomaticCardFile,
							as: 'ownerDiplomaticCardFiles',
						},
					],
				},
			];

			if (creatorId) {
				queryFields.creatorId = creatorId;
			}

			if (organismId) {
				queryFields.organismId = organismId;
			}
			if (id) {
				queryFields.id = id;
			}

			const { count, rows } = await db.RenewOwnerDC.findAndCountAll({
				limit: Number(limit) * 1 || undefined,
				offset: offset || undefined,
				where: { ...queryFields },
				order: [['createdAt', sort]],
				include,
			});
			return { count, rows };
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.FETCH_FAILURE_MESSAGE,
				HttpStatusCode.BadRequest,
				error.message,
			);
		}
	}

	async getOne(fields: object): Promise<RenewOwnerDC> {
		try {
			const ownerdc = await db.RenewOwnerDC.findOne({
				where: { ...fields },
				include: [
					{
						model: OwnerDiplomaticCard,
						as: 'previousCard',
						include: [
							{
								model: db.Institution,
								as: 'organism',
							},
							{
								model: db.OwnerDiplomaticCardFile,
								as: 'ownerDiplomaticCardFiles',
							},
						],
					},
				],
			});
			if (!ownerdc) {
				throw new HttpException('Non toruvable', HttpStatusCode.NotFound);
			}
			return ownerdc;
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				HttpStatusCode.InternalServerError,
				error.message,
			);
		}
	}
}
