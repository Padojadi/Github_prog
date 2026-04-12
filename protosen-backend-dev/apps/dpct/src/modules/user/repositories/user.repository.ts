import { Op } from 'sequelize';
import db, { User, Institution, AccessGroup } from 'database/models';

import HttpException from '../../../shared/errors/HttpException';
import { HttpStatusCode } from 'axios';
import {
	IRegisterUser,
	ISuperAdminRegisterUser,
	ISuperAdminUpdateUser,
	IUpdateUser,
	RoleEnum,
} from '../types';
import { IQueryOptions, IResults, StatusEnum } from '@shared/types';
import { ERROR_MESSAGE } from '@constants/messages';
import { AUTH_MESSAGES } from '@constants/index';

interface IUsersRepo {
	saveSup(data: IRegisterUser): Promise<User | any>;

	save(data: IRegisterUser): Promise<User | any>;

	update(id: string, data: IUpdateUser): Promise<User | null>;

	updateSup(id: string, data: ISuperAdminUpdateUser): Promise<User | null>;

	updatePassword(id: string, password: string): Promise<User | null>;

	delete(id: string): Promise<void | null>;

	getById(id: string): Promise<User | null>;

	getByIds(ids: string[]): Promise<User[]>;

	getAll(queryOptions: IQueryOptions): Promise<IResults<User>>;

	getOne(fields: object): Promise<User | null>;
}

export class UsersRepo implements IUsersRepo {
	async saveSup(data: ISuperAdminRegisterUser): Promise<User | any> {
		try {
			return await db.User.create({
				...data,
				status: StatusEnum.ACTIVE,
				deleted: false,
				accessGroupId: data.accessGroupId,
			} as any);
		} catch  {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}
	async save(data: IRegisterUser): Promise<User | any> {
		try {
			return await db.User.create({
				...data,
				role: data.role || RoleEnum.USER,
				status: data.status || StatusEnum.ACTIVE,
				deleted: data.deleted || false,
				confirmed: data.confirmed || false,
			});
		} catch  {
			throw new HttpException(ERROR_MESSAGE.CREATION_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async update(id: string, data: IUpdateUser): Promise<User | null> {
		try {
			const user = await db.User.findByPk(id);
			if (!user) {
				throw new HttpException(AUTH_MESSAGES.ACCOUNT_NOT_FOUND, HttpStatusCode.NotFound);
			}
			await user.update(data);
			return await user.save();
		} catch  {
			throw new HttpException(ERROR_MESSAGE.UPDATE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async updateSup(id: string, data: ISuperAdminUpdateUser): Promise<User | null> {
		try {
			const user = await db.User.findByPk(id);
			if (!user) {
				throw new HttpException(AUTH_MESSAGES.ACCOUNT_NOT_FOUND, HttpStatusCode.NotFound);
			}
			const { role, ...restData } = data;
			await user.update({
				...restData,
				...(role && { role: role as unknown as RoleEnum }),
			});
			return await user.save();
		} catch  {
			throw new HttpException(ERROR_MESSAGE.UPDATE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}
	async updatePassword(id: string, password: string): Promise<User | null> {
		try {
			const user = await db.User.findByPk(id);
			if (!user) {
				throw new HttpException(AUTH_MESSAGES.ACCOUNT_NOT_FOUND, HttpStatusCode.NotFound);
			}
			await user.update({ password: password });
			return await user.save();
		} catch  {
			throw new HttpException(ERROR_MESSAGE.UPDATE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async delete(id: string): Promise<void | null> {
		try {
			const user = await db.User.findByPk(id);
			if (!user) {
				throw new HttpException(AUTH_MESSAGES.ACCOUNT_NOT_FOUND, HttpStatusCode.NotFound);
			}
			return await user.destroy();
		} catch  {
			throw new HttpException(ERROR_MESSAGE.DELETE_FAILURE_MESSAGE, HttpStatusCode.BadRequest);
		}
	}

	async getById(id: string): Promise<User | null> {
		try {
			return await db.User.findByPk(id, {
				include: [
					{ model: Institution, as: 'organism' },
					{ model: AccessGroup, as: 'accessGroup' },
				],
			});
		} catch  {
			throw new HttpException(ERROR_MESSAGE.NOT_FOUND_MESSAGE, HttpStatusCode.NotFound);
		}
	}

	async getAll(queryOptions: IQueryOptions): Promise<IResults<User>> {
		try {
			const { status, search, page, limit, sort = 'desc', organismId } = queryOptions;
			const offset = (Number(page) - 1) * Number(limit);
			const queryFields: any = {};

			if (search) {
				queryFields[Op.or] = [
					{ email: { [Op.iLike]: `%${search}%` } },
					{ first_name: { [Op.iLike]: `%${search}%` } },
					{ last_name: { [Op.iLike]: `%${search}%` } },
				];
			}
			if (status) {queryFields.status = status;}
			if (organismId) {queryFields.organismId = organismId;}

			const { count, rows } = await db.User.findAndCountAll({
				limit: Number(limit) * 1 || undefined,
				offset: offset || undefined,
				where: queryFields,
				order: [['createdAt', sort]],
				include: [
					{ model: Institution, as: 'organism' },
					{ model: AccessGroup, as: 'accessGroup' },
				],
			});
			return { count, rows };
		} catch  {
			throw new Error(ERROR_MESSAGE.FETCH_FAILURE_MESSAGE);
		}
	}

	async getOne(fields: object): Promise<User | null> {
		try {
			return await db.User.findOne({
				where: { ...fields },
				include: [
					{ model: Institution, as: 'organism' },
					{ model: AccessGroup, as: 'accessGroup' },
				],
			});
		} catch  {
			throw new Error(ERROR_MESSAGE.NOT_FOUND_MESSAGE);
		}
	}

	async getByIds(ids: string[]): Promise<User[]> {
		try {
			return await db.User.findAll({
				where: {
					id: {
						[Op.in]: ids,
					},
				},
				include: [
					{ model: Institution, as: 'organism' },
					{ model: AccessGroup, as: 'accessGroup' },
				],
			});
		} catch  {
			throw new Error(ERROR_MESSAGE.FETCH_FAILURE_MESSAGE);
		}
	}
}
