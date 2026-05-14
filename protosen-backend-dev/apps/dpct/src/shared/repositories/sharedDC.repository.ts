import { HttpStatusCode } from 'axios';
import HttpException from '../errors/HttpException';
import { IQueryOptionsDC } from '../../modules/cards/types/card.types';
import { IResults, StatusEnum } from '../types/common.types';
import { Op } from 'sequelize';
import { Institution } from 'database/models';
import { ERROR_MESSAGE } from '@constants/messages';

interface ISharedDCRepo<T, C, U> {
	save(data: C): Promise<T>;
	update(id: string, data: U): Promise<T>;
	delete(id: string): Promise<void>;
	getById(id: string): Promise<T>;
	getAll(queryOptions: IQueryOptionsDC): Promise<IResults<T>>;
	getOne(fields: object): Promise<T | null>;
}

export abstract class BaseSharedDCRepo<T, C, U> implements ISharedDCRepo<T, C, U> {
	abstract model: any; // Specify the Sequelize model
	abstract includeModel: any; // Specify the Sequelize model
	abstract includeFileModel?: any; // Specify the file model (optional)
	abstract fileAssociationName?: string; // Name of the file association (e.g., 'spouseDCFiles')

	async save(data: C): Promise<T> {
		try {
			return await this.model.create({ ...data });
		} catch {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async update(id: string, data: U): Promise<T> {
		try {
			const instance = await this.model.findByPk(id);
			if (!instance) {
				throw new HttpException('Carte non trouvable', HttpStatusCode.NotFound);
			}
			await instance.update(data);
			return await instance.save();
		} catch {
			throw new HttpException(ERROR_MESSAGE.UPDATE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async delete(id: string): Promise<void> {
		try {
			const instance = await this.model.findByPk(id);
			if (!instance) {
				throw new HttpException('Carte non trouvable', HttpStatusCode.NotFound);
			}
			await instance.destroy();
		} catch {
			throw new HttpException(ERROR_MESSAGE.DELETE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getById(id: string): Promise<T> {
		try {
			const previousCardInclude: any = {
				model: this.includeModel,
				as: 'previousCard',
				include: [
					{
						model: Institution,
						as: 'organism',
					},
				],
			};

			// Add files if model is defined
			if (this.includeFileModel && this.fileAssociationName) {
				previousCardInclude.include.push({
					model: this.includeFileModel,
					as: this.fileAssociationName,
				});
			}

			const instance = await this.model.findByPk(id, {
				include: [previousCardInclude],
			});
			if (!instance) {
				throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
			}
			return instance;
		} catch {
			throw new HttpException(ERROR_MESSAGE.FETCH_FAILURE_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async getAll(queryOptions: IQueryOptionsDC): Promise<IResults<T>> {
		try {
			const {
				status,
				search,
				page,
				limit,
				sort = 'desc',
				documentStage,
				organismId,
				ownerCardId,
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

			const previousCardInclude: any = {
				model: this.includeModel,
				as: 'previousCard',
				include: [
					{
						model: Institution,
						as: 'organism',
					},
				],
			};

			// Add files if model is defined
			if (this.includeFileModel && this.fileAssociationName) {
				previousCardInclude.include.push({
					model: this.includeFileModel,
					as: this.fileAssociationName,
				});
			}

			const include = [previousCardInclude];

			if (creatorId) {
				queryFields.creatorId = creatorId;
			}

			if (organismId) {
				queryFields.organismId = organismId;
			}

			if (ownerCardId) {
				previousCardInclude.where = { ...(previousCardInclude.where || {}), ownerDiplomaticCardId: ownerCardId };
			}

			if (id) {
				queryFields.id = id;
			}
			const { count, rows } = await this.model.findAndCountAll({
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

	async getOne(fields: { id?: string; organismId?: string; creatorId?: string }): Promise<T> {
		try {
			const { id, organismId, creatorId, ...otherFields } = fields;
			const queryFields: any = { ...otherFields };

			if (id) {
				queryFields.id = id;
			}

			if (organismId) {
				queryFields.organismId = organismId;
			}

			if (creatorId) {
				queryFields.creatorId = creatorId;
			}

			const previousCardInclude: any = {
				model: this.includeModel,
				as: 'previousCard',
				include: [
					{
						model: Institution,
						as: 'organism',
					},
				],
			};

			// Add files if model is defined
			if (this.includeFileModel && this.fileAssociationName) {
				previousCardInclude.include.push({
					model: this.includeFileModel,
					as: this.fileAssociationName,
				});
			}

			const instance = await this.model.findOne({
				where: queryFields,
				include: [previousCardInclude],
			});
			if (!instance) {
				throw new HttpException('Carte non trouvable', HttpStatusCode.NotFound);
			}
			return instance;
		} catch {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}
}

export interface IBaseDuplicataDCRepo<T, C, U> {
	save(data: C): Promise<T>;

	getById(id: string): Promise<T>;

	getAll(queryOptions: IQueryOptionsDC): Promise<IResults<T>>;

	hardDelete(id: string): Promise<void | null>;

	softDelete(id: string): Promise<void | null>;

	getOne(fields: object): Promise<T | null>;

	update(id: string, data: U): Promise<T>;
}

export abstract class BaseDuplicataDCRepo<T, C, U> implements IBaseDuplicataDCRepo<T, C, U> {
	abstract model: any; // Specify the Sequelize model
	abstract includeModel: any;
	renewIncludeModel?: any; // Renew model for duplicata from renewed cards

	async save(data: C): Promise<T> {
		try {
			return await this.model.create({ ...data });
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.CREATION_FAILURE_MESSAGE,
				error.status !== HttpStatusCode.InternalServerError
					? error.status
					: HttpStatusCode.InternalServerError,
			);
		}
	}

	async getById(id: string): Promise<T> {
		try {
			const include: any[] = [
				{
					model: this.includeModel,
					as: 'previousCard',
					required: false,
					include: [{ model: Institution, as: 'organism' }],
				},
			];

			if (this.renewIncludeModel) {
				include.push({
					model: this.renewIncludeModel,
					as: 'renewCard',
					required: false,
					include: [
						{
							model: this.includeModel,
							as: 'previousCard',
							include: [{ model: Institution, as: 'organism' }],
						},
					],
				});
			}

			const instance = await this.model.findByPk(id, { include });
			if (!instance)
				{throw new HttpException('Carte Duplicata non trouvable', HttpStatusCode.NotFound);}
			return instance;
		} catch (error: any) {
			throw new HttpException(
				ERROR_MESSAGE.NOT_FOUND_MESSAGE,
				error.status !== HttpStatusCode.InternalServerError
					? error.status
					: HttpStatusCode.InternalServerError,
			);
		}
	}

	async getAll(queryOptions: IQueryOptionsDC): Promise<IResults<T>> {
		try {
			const {
				status,
				search,
				page,
				limit,
				sort = 'desc',
				documentStage,
				creatorId,
				id,
				expired,
				previousCardId,
				organismId,
				ownerCardId,
			} = queryOptions;
			const offset = (Number(page) - 1) * Number(limit);
			const queryFields: any = {};
			const queryFieldsOpt: any = {};

			if (search) {
				queryFields.id = { [Op.iLike]: `%${search}%` };
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

			if (documentStage) {
				queryFieldsOpt.documentStage = documentStage;
			}

			if (previousCardId) {
				queryFieldsOpt.previousCardId = previousCardId;
			}

			if (id) {
				queryFieldsOpt.id = id;
			}

			if (creatorId) {
				queryFieldsOpt.creatorId = creatorId;
			}

			if (organismId) {
				queryFieldsOpt.organismId = organismId;
			}

			if (ownerCardId) {
				queryFields.ownerDiplomaticCardId = ownerCardId;
			}

			const include: any[] = [
				{
					model: this.includeModel,
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
			];

			if (this.renewIncludeModel) {
				include.push({
					model: this.renewIncludeModel,
					as: 'renewCard',
					required: false,
					include: [
						{
							model: this.includeModel,
							as: 'previousCard',
							include: [{ model: Institution, as: 'organism' }],
						},
					],
				});
			}

			const { count, rows } = await this.model.findAndCountAll({
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

	async update(id: string, data: U): Promise<T> {
		try {
			const instance = await this.model.findByPk(id);
			if (!instance) {
				throw new HttpException('Carte Duplicata non trouvable', HttpStatusCode.NotFound);
			}
			await instance.update(data);
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
			const card = await this.model.findByPk(id);
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
			const card = await this.model.findByPk(id);
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

	async getOne(fields: object): Promise<T | null> {
		try {
			const include: any[] = [
				{
					model: this.includeModel,
					as: 'previousCard',
					required: false,
					include: [{ model: Institution, as: 'organism' }],
				},
			];

			if (this.renewIncludeModel) {
				include.push({
					model: this.renewIncludeModel,
					as: 'renewCard',
					required: false,
					include: [
						{
							model: this.includeModel,
							as: 'previousCard',
							include: [{ model: Institution, as: 'organism' }],
						},
					],
				});
			}

			return await this.model.findOne({ ...fields, include });
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
