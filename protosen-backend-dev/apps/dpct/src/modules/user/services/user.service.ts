import { User } from 'database/models';
import { UsersRepo } from '../repositories/user.repository';
import { ISuperAdminUpdateUser, IUpdateUser } from '../types';
import { IQueryOptions, IResults } from '@shared/types';
import { JwtPayload } from 'jsonwebtoken';
import { verifyJwt } from '@shared/libs/jwt/jwt';

interface IUsersService {
	update(id: string, data: IUpdateUser): Promise<User | null>;

	updateSup(id: string, data: ISuperAdminUpdateUser): Promise<User | null>;

	updatePassword(id: string, password: string): Promise<User | null>;

	delete(id: string): Promise<void | null>;

	getUserById(id: string): Promise<User | null>;

	getUsersByIds(ids: string[]): Promise<User[]>;

	getUserByToken(token: string): Promise<User | null>;

	getUsers(queryOptions: IQueryOptions): Promise<IResults<User>>;

	getOne(fields: object): Promise<User | null>;
}

export class UsersService implements IUsersService {
	async update(id: string, data: IUpdateUser): Promise<User | null> {
		return await new UsersRepo().update(id, data);
	}

	async updateSup(id: string, data: ISuperAdminUpdateUser): Promise<User | null> {
		return await new UsersRepo().update(id, data);
	}

	async updatePassword(id: string, password: string): Promise<User | null> {
		return await new UsersRepo().updatePassword(id, password);
	}

	async delete(id: string) {
		return await new UsersRepo().delete(id);
	}

	async getUserById(id: string): Promise<User | null> {
		return await new UsersRepo().getById(id);
	}

	async getUsers(queryOptions: IQueryOptions): Promise<IResults<User>> {
		return await new UsersRepo().getAll(queryOptions);
	}

	async getOne(field: object): Promise<User | null> {
		return await new UsersRepo().getOne(field);
	}

	async getUsersByIds(ids: string[]): Promise<User[]> {
		return await new UsersRepo().getByIds(ids);
	}

	async getUserByToken(token: string): Promise<User | null> {
		const decoded = verifyJwt<JwtPayload>(token, 'accessTokenPublicKey');

		if (!decoded) {
			throw new Error('Token invalide');
		}

		if (decoded.exp && new Date(decoded.exp * 1000) < new Date()) {
			throw new Error('Token expiré');
		}

		return await this.getUserById(decoded.id);
	}
}
