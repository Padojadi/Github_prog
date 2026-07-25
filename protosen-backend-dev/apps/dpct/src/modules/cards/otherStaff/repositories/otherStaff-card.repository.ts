import { Op, WhereOptions } from 'sequelize';
import { HttpStatusCode } from 'axios';
import HttpException from '@shared/errors/HttpException';
import db, {
	OtherStaffDC,
	OtherStaffDCFile,
	Institution,
	RenewOtherStaffDC,
	OwnerDiplomaticCard,
} from 'database/models';
import {
	EDocumentState,
	ICreateSpouseDC,
	IQueryOptionsDC,
	IUpdateSpouseDC,
} from '@modules/cards/types';
import { IResults, StatusEnum } from '@shared/types';
import { ERROR_MESSAGE } from '@constants/messages';

interface IOtherStaffDCRepo {
	save(data: ICreateSpouseDC): Promise<OtherStaffDC>;

	update(id: string, data: IUpdateSpouseDC): Promise<OtherStaffDC | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<OtherStaffDC | null>;

	getAll(queryOptions: IQueryOptionsDC): Promise<IResults<OtherStaffDC>>;

	getOne(fields: object): Promise<OtherStaffDC | null>;
}

export class OtherStaffDCRepo implements IOtherStaffDCRepo {
	async save(data: ICreateSpouseDC): Promise<OtherStaffDC> {
		try {
			return await db.OtherStaffDC.create({
				...data,
				expired: data.expired ?? false,
				status: StatusEnum.ACTIVE,
				documentStage: EDocumentState.ONHOLD,
			} as any);
		} catch {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async update(id: string, data: IUpdateSpouseDC): Promise<OtherStaffDC | null> {
		try {
			const user = await db.OtherStaffDC.findByPk(id);
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
			const user = await db.OtherStaffDC.findByPk(id);
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

	async getById(id: string): Promise<OtherStaffDC | null> {
		try {
			return await OtherStaffDC.findByPk(id, {
				include: [
					{ model: OtherStaffDCFile, as: 'otherStaffDCFiles' },
					{ model: Institution, as: 'organism' },
					{ model: OwnerDiplomaticCard, as: 'ownerDiplomaticCard' },
					{
						model: RenewOtherStaffDC,
						as: 'renewals',
					},
				],
			});
		} catch (error) {
			console.error('Error fetching OtherStaffDC by ID:', error);
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async getAll(queryOptions: IQueryOptionsDC): Promise<IResults<OtherStaffDC>> {
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
			const queryFields: WhereOptions<OtherStaffDC> = {};

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

			const { count, rows } = await db.OtherStaffDC.findAndCountAll({
				limit: Number(limit) * 1 || undefined,
				offset: offset || undefined,
				where: queryFields,
				order: [['createdAt', sort]],
				include: [
					{ model: Institution, as: 'organism' },
					{
						model: RenewOtherStaffDC,
						as: 'renewals',
						attributes: ['id'],
					},
				],
			});
			return { count, rows };
		} catch (error) {
			console.error('Error fetching OtherStaffDC:', error);
			throw new HttpException(ERROR_MESSAGE.FETCH_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getOne(fields: object): Promise<OtherStaffDC | null> {
		try {
			return await db.OtherStaffDC.findOne({
				where: { ...fields },
				include: [
					{ model: OtherStaffDCFile, as: 'otherStaffDCFiles' },
					{ model: Institution, as: 'organism' },
					{ model: OwnerDiplomaticCard, as: 'ownerDiplomaticCard' },
					{
						model: RenewOtherStaffDC,
						as: 'renewals',
					},
				],
			});
		} catch (error) {
			console.error('Error fetching OtherStaffDC with fields:', error);
			throw new Error(ERROR_MESSAGE.NOT_FOUND_MESSAGE);
		}
	}
}
