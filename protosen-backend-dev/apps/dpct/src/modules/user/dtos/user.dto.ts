import { TypeOf, object, string, z } from 'zod';
import { SuperAdminRoleEnum } from '../types';
import { StatusEnum } from '@shared/types';

const StatusType = z.nativeEnum(StatusEnum);
const SuperAdminRoleType = z.nativeEnum(SuperAdminRoleEnum);

export const updateUserSchema = object({
	body: object({
		first_name: string().trim().optional(),
		last_name: string().trim().optional(),
		email: string().email().trim().optional(),
		phone: string().optional(),
	}).strict(),
});

export const superAdminUpdateUserSchema = object({
	params: object({
		id: string().uuid(),
	}),
	body: object({
		role: SuperAdminRoleType.optional(),
		status: StatusType.optional(),
		first_name: string().trim().optional(),
		last_name: string().trim().optional(),
		phone: string().optional(),
		email: string().email().trim().optional(),
		organismId: string().uuid().optional(),
		accessGroupId: string().optional(),
	}).strict(),
});

export const userByIdSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
});

export const getUsersSchema = object({
	query: object({
		status: StatusType.optional(),
		search: string().optional(),
		limit: string().optional(),
		page: string().optional(),
		sort: string().optional(),
		organismId: string().uuid().optional(),
	}).strict(),
});

export const updatePasswordSchema = object({
	body: object({
		password: string({
			required_error: 'Mot de passe requis',
		}),
		new_password: string({
			required_error: 'Mot de passe requis',
		}),
		confirm_new_password: string({
			required_error: 'Confirmation du mot de passe requis',
		}),
	})
		.strict()
		.refine((data) => data.new_password === data.confirm_new_password, {
			message: 'Mot de passe non semblable',
			path: ['passwordConfirmation'],
		}),
});

export const sendCodeSchema = object({
	body: object({
		email: string().email(),
	}),
});

export const resetPasswordSchema = object({
	body: object({
		email: string().email(),
		verification_code: string(),
		new_password: string({
			required_error: 'Mot de passe requis',
		}),
		confirm_new_password: string({
			required_error: 'Confirmation du mot de passe requis',
		}),
	})
		.strict()
		.refine((data) => data.new_password === data.confirm_new_password, {
			message: 'Mot de passe non semblable',
			path: ['passwordConfirmation'],
		}),
});

export const superAdminresetUserPasswordSchema = object({
	body: object({
		email: string().email(),
		new_password: string({
			required_error: 'Mot de passe requis',
		}),
		confirm_new_password: string({
			required_error: 'Confirmation du mot de passe requis',
		}),
	})
		.strict()
		.refine((data) => data.new_password === data.confirm_new_password, {
			message: 'Mot de passe non semblable',
			path: ['passwordConfirmation'],
		}),
});

export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
export type UserByIdInput = TypeOf<typeof userByIdSchema>['params'];
export type UsersInput = TypeOf<typeof getUsersSchema>['query'];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>['body'];
export type SuperAdminResetPasswordInput = TypeOf<typeof superAdminresetUserPasswordSchema>['body'];
export type UpdatePasswordInput = TypeOf<typeof updatePasswordSchema>['body'];
export type SendCodeInput = TypeOf<typeof sendCodeSchema>['body'];
export type SuperAdminUpdateUserInput = TypeOf<typeof superAdminUpdateUserSchema>;
