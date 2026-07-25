import { object, string, TypeOf, z } from 'zod';
import { SuperAdminRoleEnum } from '../../user/types/user.types';

const SupRegisterRoles = z.nativeEnum(SuperAdminRoleEnum);

const baseCreateUserSchema = object({
	password: string(),
	passwordConfirmation: string(),
	email: string().email(),
	first_name: string().trim(),
	last_name: string().trim(),
	phone: string().trim().optional(),
}).strict();

export const registerUserSchema = object({
	body: baseCreateUserSchema
		.extend({
			organismId: string().uuid(),
			accessGroupId: string(),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: 'Mot de passe non semblable',
			path: ['passwordConfirmation'],
		}),
});

export const loginSchema = object({
	body: object({
		email: string({
			required_error: 'email is required',
		}),
		password: string({
			required_error: 'Password is required',
		}).min(6, 'Invalid format'),
	}).strict(),
});

//super admin creating users
export const registerUserBySupAdminSchema = object({
	body: baseCreateUserSchema
		.extend({
			organismId: string().uuid(),
			role: SupRegisterRoles,
			accessGroupId: string(),
		})
		.strict()
		.refine((data) => data.password === data.passwordConfirmation, {
			message: 'Mot de passe non semblable',
			path: ['passwordConfirmation'],
		}),
});

export const confirmAccountSchema = object({
	body: object({
		email: string().email(),
		verification_code: string().min(5, 'Invalid format'),
	}).strict(),
});

export type LoginInput = TypeOf<typeof loginSchema>['body'];
export type RegisterUserInput = TypeOf<typeof registerUserSchema>['body'];
export type RegisterUserBySupAdminInput = TypeOf<typeof registerUserBySupAdminSchema>['body'];
export type ConfirmUserInput = TypeOf<typeof confirmAccountSchema>['body'];
