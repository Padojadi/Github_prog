import { HttpStatusCode } from 'axios';
import HttpException from '../../../../shared/errors/HttpException';

import { Op } from 'sequelize';
import db, { OwnerDiplomaticCard, OwnerDuplicataDC, Institution, RenewOwnerDC } from 'database/models';
import { ICreateDuplicataDC, IQueryOptionsDC, IUpdateRenewSpouseDC } from '@modules/cards/types';
import { IResults, StatusEnum } from '@shared/types';
import { ERROR_MESSAGE } from '@constants/messages';

export interface IOwnerDuplicataDCRepo {
	save(data: ICreateDuplicataDC): Promise<OwnerDuplicataDC>;

	getById(id: string): Promise<OwnerDuplicataDC>;

	getAll(queryOptions: IQueryOptionsDC): Promise<IResults<OwnerDuplicataDC>>;

	update(id: string, data: IUpdateRenewSpouseDC): Promise<OwnerDuplicataDC>;

	hardDelete(id: string): Promise<void | null>;

	softDelete(id: string): Promise<void | null>;

	getOne(fields: object): Promise<OwnerDuplicataDC | null>;
}

export class OwnerDuplicataDCRepo implements IOwnerDuplicataDCRepo {
	async save(data: ICreateDuplicataDC): Promise<OwnerDuplicataDC> {
		try {
			return await db.OwnerDuplicataDC.create({ ...data } as any);
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.CREATION_FAILURE_MESSAGE,
				error.status !== HttpStatusCode.InternalServerError
					? error.status
					: HttpStatusCode.InternalServerError,
			);
		}
	}

	async getById(id: string): Promise<OwnerDuplicataDC> {
		try {
			const owner = await db.OwnerDuplicataDC.findByPk(id, {
				include: [
					{
						model: OwnerDiplomaticCard,
						as: 'previousCard',
						required: false,
						include: [{ model: Institution, as: 'organism' }],
					},
					{
						model: RenewOwnerDC,
						as: 'renewCard',
						required: false,
						include: [
							{
								model: OwnerDiplomaticCard,
								as: 'previousCard',
								include: [{ model: Institution, as: 'organism' }],
							},
						],
					},
				],
			});
			if (!owner) {throw new HttpException('Carte Duplicata non trouvable', HttpStatusCode.NotFound);}
			return owner;
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				error.status !== HttpStatusCode.InternalServerError
					? error.status
					: HttpStatusCode.InternalServerError,
			);
		}
	}

	async getAll(queryOptions: IQueryOptionsDC): Promise<IResults<OwnerDuplicataDC>> {
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
				id,
				expired,
			} = queryOptions;
			const offset = (Number(page) - 1) * Number(limit);
			const queryFields: any = {};
			const queryFieldsOpt: any = {};

			if (search) {
				queryFields.email = { [Op.iLike]: `%${search}%` };
				queryFields.firstName = { [Op.iLike]: `%${search}%` };
				queryFields.lastName = { [Op.iLike]: `%${search}%` };
			}

			if (expired) {
				queryFields.expired = expired === 'true';
			}

			if (status) {
				queryFieldsOpt.status = status;
			}

			if (demandType) {
				queryFields.demandType = demandType;
			}

			if (documentStage) {
				queryFieldsOpt.documentStage = documentStage;
			}

			if (organismId) {
				queryFields.organismId = organismId;
			}

			if (id) {
				queryFields.id = id;
				queryFieldsOpt.id = id;
			}

			if (creatorId) {
				queryFields.creatorId = creatorId;
			}

			const include: any[] = [
				{
					model: OwnerDiplomaticCard,
					as: 'previousCard',
					required: false,
					where: Object.keys(queryFields).length > 0 ? queryFields : undefined,
					include: [
						{
							model: Institution,
							as: 'organism',
						},
					],
				},
				{
					model: RenewOwnerDC,
					as: 'renewCard',
					required: false,
					include: [
						{
							model: OwnerDiplomaticCard,
							as: 'previousCard',
							include: [{ model: Institution, as: 'organism' }],
						},
					],
				},
			];
			const { count, rows } = await db.OwnerDuplicataDC.findAndCountAll({
				limit: Number(limit) * 1 || undefined,
				offset: offset || undefined,
				where: queryFieldsOpt,
				order: [['createdAt', sort]],
				include: include,
			});
			return { count, rows };
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.FETCH_FAILURE_MESSAGE,
				error.status !== HttpStatusCode.InternalServerError
					? error.status
					: HttpStatusCode.InternalServerError,
			);
		}
	}

	async update(id: string, data: IUpdateRenewSpouseDC): Promise<OwnerDuplicataDC> {
		try {
			const instance = await db.OwnerDuplicataDC.findByPk(id);
			if (!instance) {
				throw new HttpException('Carte Duplicata non trouvable', HttpStatusCode.NotFound);
			}
			await instance.update(data as any);
			return await instance.save();
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.UPDATE_FAILURE_MESSAGE,
				error.status !== HttpStatusCode.InternalServerError
					? error.status
					: HttpStatusCode.InternalServerError,
			);
		}
	}

	async softDelete(id: string): Promise<void | null> {
		try {
			const card = await db.OwnerDuplicataDC.findByPk(id);
			if (!card) {
				throw new HttpException('Carte Duplicata non trouvable', HttpStatusCode.NotFound);
			}
			await card.update({ status: StatusEnum.DISABLED });
			return;
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.DELETE_FAILURE_MESSAGE,
				error.status !== HttpStatusCode.InternalServerError
					? error.status
					: HttpStatusCode.InternalServerError,
			);
		}
	}

	async hardDelete(id: string): Promise<void | null> {
		try {
			const card = await db.OwnerDuplicataDC.findByPk(id);
			if (!card) {
				throw new HttpException('Carte Duplicata non trouvable', HttpStatusCode.NotFound);
			}
			return await card.destroy();
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.DELETE_FAILURE_MESSAGE,
				error.status !== HttpStatusCode.InternalServerError
					? error.status
					: HttpStatusCode.InternalServerError,
			);
		}
	}

	async getOne(fields: object): Promise<OwnerDuplicataDC | null> {
		try {
			return await db.OwnerDuplicataDC.findOne({
				...fields,
				include: [
					{
						model: OwnerDiplomaticCard,
						as: 'previousCard',
						required: false,
						include: [{ model: Institution, as: 'organism' }],
					},
					{
						model: RenewOwnerDC,
						as: 'renewCard',
						required: false,
						include: [
							{
								model: OwnerDiplomaticCard,
								as: 'previousCard',
								include: [{ model: Institution, as: 'organism' }],
							},
						],
					},
				],
			});
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				error.status !== HttpStatusCode.InternalServerError
					? error.status
					: HttpStatusCode.InternalServerError,
				error.message,
			);
		}
	}
}
