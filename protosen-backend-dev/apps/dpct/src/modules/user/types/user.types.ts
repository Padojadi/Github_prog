import { StatusEnum } from '@shared/types';

/**
 * Types spécifiques au module User
 */

export enum RoleEnum {
	USER = 'user',
	ADMIN = 'admin',
	SUPERADMIN = 'super_admin',
}

export enum SuperAdminRoleEnum {
	USER = 'user',
	ADMIN = 'admin',
}

export interface ISuperAdminRegisterUser {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	organismId: string;
	accessGroupId: string;
	//TO -REMOVE
	confirmed?: boolean;
}

export interface ISuperAdminUpdateUser {
	email?: string;
	first_name?: string;
	phone?: string;
	last_name?: string;
	organismId?: string;
	role?: SuperAdminRoleEnum;
}

export interface IRegisterUser {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	organismId: string;
	accessGroupId: string;
	role?: RoleEnum;
	status?: StatusEnum;
	deleted?: boolean;
	//TO -REMOVE
	confirmed?: boolean;
}

export interface IUpdateUser {
	email?: string;
	status?: StatusEnum;
	phone?: string | null;
	password?: string;
	verification_code?: string | null;
	verification_code_ttl?: Date | null;
	confirmed?: boolean;
}

export interface IUpdateUserRole {
	role: RoleEnum.ADMIN | RoleEnum.USER;
}
