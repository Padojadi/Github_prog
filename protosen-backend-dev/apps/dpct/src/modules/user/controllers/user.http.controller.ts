import { Request, Response } from 'express';
import {
	ResetPasswordInput,
	SendCodeInput,
	SuperAdminResetPasswordInput,
	SuperAdminUpdateUserInput,
	UpdatePasswordInput,
	UpdateUserInput,
	UserByIdInput,
	UsersInput,
} from '../dtos/user.dto';
import { UsersRepo } from '../repositories/user.repository';
import { HttpStatusCode } from 'axios';
import { UsersService } from '../services/user.service';
import { AUTH_MESSAGES } from '@constants/index';
import Authentication from '@shared/utils/auth.util';
import { generateRandomCode } from '@shared/utils/functions';
import sendEmail, { smtp } from '@shared/utils/mailer';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@constants/messages';

class UserController {
	async getUser(req: Request, res: Response) {
		try {
			const userId = res.locals.user.id;
			const user = await new UsersService().getUserById(userId);

			if (!user) {
				return res.status(HttpStatusCode.NotFound).json({
					message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND,
				});
			}

			return res.status(HttpStatusCode.Ok).json({
				data: user,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async getUserById(req: Request<UserByIdInput>, res: Response) {
		try {
			const { id } = req.params;
			const user = await new UsersService().getUserById(id);

			if (!user) {
				return res.status(HttpStatusCode.NotFound).json({
					message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND,
				});
			}

			return res.status(HttpStatusCode.Ok).json({
				data: user,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async UpdatePassword(req: Request<{}, {}, UpdatePasswordInput>, res: Response) {
		try {
			const { password, new_password } = req.body;
			const email = res.locals.user.email;

			const existingUser = await new UsersRepo().getOne({ email: email });
			if (!existingUser)
				{return res
					.status(HttpStatusCode.NotFound)
					.json({ message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND });}

			const isValid = await Authentication.passwordCompare(password, existingUser.password);
			if (!isValid)
				{return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: AUTH_MESSAGES.INVALID_CREDENTIALS });}

			const hashedPassword: string = await Authentication.passwordHash(new_password);
			await new UsersService().updatePassword(existingUser.id, hashedPassword);

			return res.status(HttpStatusCode.Ok).json({
				message: AUTH_MESSAGES.MOT_DE_PASSE_MIS_A_JOUR,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async sendCode(req: Request<SendCodeInput>, res: Response) {
		try {
			const { email } = req.body;
			const existingUser = await new UsersRepo().getOne({ email: email });
			if (!existingUser)
				{return res
					.status(HttpStatusCode.NotFound)
					.json({ message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND });}

			const code = generateRandomCode();
			const ttl = new Date(Date.now() + 15 * 60 * 1000);

			await new UsersService().update(existingUser.id, {
				verification_code: code,
				verification_code_ttl: ttl,
			});

			await sendEmail({
				from: smtp.user,
				to: existingUser.email,
				subject: 'Mis à jour de votre mot de passe',
				text: `Votre code de verification est: ${code} `,
			});
			return res.status(HttpStatusCode.Ok).json({
				message: AUTH_MESSAGES.CODE_ENVOYE,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async updateUser(req: Request<{}, {}, UpdateUserInput['body']>, res: Response) {
		try {
			const data = req.body;
			const userId = res.locals.user.id;
			const user = await new UsersService().getUserById(userId);
			if (!user) {
				return res
					.status(HttpStatusCode.NotFound)
					.json({ message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND });
			}

			if (data.email) {
				const isEmailExist = await new UsersService().getOne({ email: data.email });

				if (isEmailExist && user.email !== data.email) {
					return res
						.status(HttpStatusCode.BadRequest)
						.json({ message: AUTH_MESSAGES.ACCOUNT_EXIST });
				}
			}
			const updatedUser = await new UsersService().update(userId, data);

			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
				data: updatedUser,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async resetPassword(req: Request<{}, {}, ResetPasswordInput>, res: Response) {
		try {
			const { new_password, verification_code, email } = req.body;

			const existingUser = await new UsersRepo().getOne({
				email: email,
				verification_code: verification_code,
			});

			if (!existingUser) {return res.status(404).json({ message: ERROR_MESSAGE.INVALID_REQUEST });}

			const hashedPassword: string = await Authentication.passwordHash(new_password);

			await new UsersService().update(existingUser.id, {
				password: hashedPassword,
				verification_code: null,
				verification_code_ttl: null,
			});

			return res.status(HttpStatusCode.Ok).json({
				message: AUTH_MESSAGES.MOT_DE_PASSE_MIS_A_JOUR,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async superAdminResetPassword(req: Request<{}, {}, SuperAdminResetPasswordInput>, res: Response) {
		try {
			const { new_password, email } = req.body;

			const existingUser = await new UsersRepo().getOne({
				email: email,
			});

			if (!existingUser) {return res.status(404).json({ message: ERROR_MESSAGE.INVALID_REQUEST });}

			const hashedPassword: string = await Authentication.passwordHash(new_password);

			await new UsersService().update(existingUser.id, {
				password: hashedPassword,
				verification_code: null,
				verification_code_ttl: null,
			});

			sendEmail({
				from: smtp.user,
				to: existingUser.email,
				subject: 'Mise à jour de votre mot de passe',
				text: `Votre mot de passe a été mis à jour par l'administrateur. Votre nouveau mot de passe est ${new_password}`,
			});

			return res.status(HttpStatusCode.Ok).json({
				message: AUTH_MESSAGES.MOT_DE_PASSE_MIS_A_JOUR,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async getUsers(req: Request<{}, {}, {}, UsersInput>, res: Response) {
		try {
			const { status, search, page, limit, sort, organismId } = req.query;
			const queryOptions = {
				status: status,
				search: search,
				page: page,
				limit: limit,
				sort: sort,
				organismId: organismId,
			};
			const response = await new UsersService().getUsers(queryOptions);
			return res.status(HttpStatusCode.Ok).json({
				message: 'successfully fetched users',
				data: response,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async superAdminUpdateUser(
		req: Request<SuperAdminUpdateUserInput['params'], {}, SuperAdminUpdateUserInput['body']>,
		res: Response,
	) {
		try {
			const { id } = req.params;
			const data = req.body;

			const existingUser = await new UsersRepo().getById(id);
			if (!existingUser)
				{return res
					.status(HttpStatusCode.NotFound)
					.json({ message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND });}

			if (data.role && existingUser.role === 'super_admin') {
				delete data.role;
			}

			if (data.email) {
				const isEmailExist = await new UsersService().getOne({ email: data.email });

				if (isEmailExist && existingUser.email !== data.email) {
					return res
						.status(HttpStatusCode.BadRequest)
						.json({ message: AUTH_MESSAGES.ACCOUNT_EXIST });
				}
			}

			const updatedUser = await new UsersService().updateSup(existingUser.id, data);

			return res.status(HttpStatusCode.Ok).json({
				message: SUCCESS_MESSAGE.UPDATE_SUCCESS_MESSAGE,
				data: updatedUser,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async supAdminDeleteUser(req: Request<UserByIdInput>, res: Response) {
		try {
			const { id } = req.params;

			const existingUser = await new UsersRepo().getById(id);
			if (!existingUser)
				{return res
					.status(HttpStatusCode.NotFound)
					.json({ message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND });}

			if (existingUser.role === 'super_admin') {
				return res
					.status(HttpStatusCode.BadRequest)
					.json({ message: AUTH_MESSAGES.CANT_DELETE_SUPER_ADMIN });
			}

			await new UsersService().delete(existingUser.id);

			return res.status(HttpStatusCode.Ok).json({
				message: AUTH_MESSAGES.DELETE_SUCCESSFULL,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}
}

export default new UserController();
