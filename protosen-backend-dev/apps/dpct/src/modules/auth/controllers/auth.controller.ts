import { Request, Response } from 'express';
import { get } from 'lodash';
import {
	ConfirmUserInput,
	LoginInput,
	RegisterUserBySupAdminInput,
	RegisterUserInput,
} from '../dtos/auth.dto';
import { UsersRepo } from '../../user/repositories/user.repository';
import { AuthenticationService } from '../services/auth.service';
import { HttpStatusCode } from 'axios';
import { AUTH_MESSAGES } from '../../../constants/messages/auth.messages';
import { UsersService } from '../../user/services/user.service';
import Authentication from '../../../shared/utils/auth.util';
import { StatusEnum } from '../../../shared/types/common.types';
import { convertExpireTimeToMilliseconds } from '../../../shared/utils/functions';
import env from '@appconfig/env.config';
import { verifyJwt } from '../../../shared/libs/jwt/jwt';

const EXPIRE_TIME = convertExpireTimeToMilliseconds(env.JWT_EXPIRES_IN);
class AuthenticationController {
	async login(req: Request<{}, {}, LoginInput>, res: Response) {
		try {
			const { email, password } = req.body;
			const user = await new UsersRepo().getOne({ email: email });
			if (!user) {
				return res.status(HttpStatusCode.NotFound).json({
					message: AUTH_MESSAGES.INVALID_CREDENTIALS,
				});
			}
			if (!user.confirmed) {
				return res.status(HttpStatusCode.Forbidden).json({
					message: AUTH_MESSAGES.INACTIVE_ACCOUNT,
				});
			}
			if (user.status === StatusEnum.DISABLED) {
				return res.status(HttpStatusCode.Forbidden).json({
					message: AUTH_MESSAGES.ACCOUNT_LOCKED,
				});
			}
			const token = await new AuthenticationService().login(
				email,
				password,
				user.password,
				user.id,
			);
			if (!token.accessToken || !token.refreshToken)
				{return res.status(HttpStatusCode.BadRequest).json({
					message: AUTH_MESSAGES.INVALID_CREDENTIALS,
				});}

			return res.status(HttpStatusCode.Ok).json({
				user: {
					id: user.id,
					email: user.email,
					first_name: user.first_name,
					last_name: user.last_name,
					role: user.role,
					organismId: user.organismId,
					organism: user.organism,
					accessGroup: user.accessGroup,
				},
				backendTokens: {
					accessToken: token.accessToken,
					refreshToken: token.refreshToken,
					expiresIn: token.expiresIn,
					message: AUTH_MESSAGES.AUTHENTICATION_SUCCESSFUL,
				},
			});
		} catch {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: AUTH_MESSAGES.SERVER_ERROR,
			});
		}
	}

	async register(req: Request<{}, {}, RegisterUserInput>, res: Response) {
		try {
			const data = req.body;
			const userData = {
				email: data.email,
				password: data.password,
				first_name: data.first_name,
				last_name: data.last_name,
				organismId: data.organismId,
				accessGroupId: data.accessGroupId,
			};
			const existingUser = await new UsersService().getOne({
				email: data.email,
			});
			if (existingUser)
				{return res.status(HttpStatusCode.Conflict).json({ message: AUTH_MESSAGES.ACCOUNT_EXIST });}

			await new AuthenticationService().register(userData);
			return res.status(HttpStatusCode.Ok).json({
				message: AUTH_MESSAGES.ACCOUNT_CREATED,
			});
		} catch {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: AUTH_MESSAGES.SERVER_ERROR,
			});
		}
	}

	async supAdminRegisterUser(req: Request<{}, {}, RegisterUserBySupAdminInput>, res: Response) {
		try {
			const data = req.body;
			const userData = {
				email: data.email,
				password: data.password,
				first_name: data.first_name,
				last_name: data.last_name,
				phone: data.phone,
				role: data.role,
				organismId: data.organismId,
				accessGroupId: data.accessGroupId,
			};
			const existingUser = await new UsersRepo().getOne({ email: data.email });
			if (existingUser)
				{return res.status(HttpStatusCode.Conflict).json({ message: AUTH_MESSAGES.ACCOUNT_EXIST });}

			await new AuthenticationService().registerSuperAdmin(userData);
			return res.status(HttpStatusCode.Ok).json({
				message: AUTH_MESSAGES.ACCOUNT_CREATED,
			});
		} catch {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: AUTH_MESSAGES.SERVER_ERROR,
			});
		}
	}

	async confirmUserAccount(req: Request<{}, {}, ConfirmUserInput>, res: Response) {
		try {
			const { verification_code, email } = req.body;

			const user = await new UsersRepo().getOne({
				email: email,
			});
			if (!user)
				{return res
					.status(HttpStatusCode.NotFound)
					.json({ message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND });}

			if (user.confirmed)
				{return res.status(HttpStatusCode.Ok).json({
					message: AUTH_MESSAGES.ACTIVE_ACCOUNT,
				});}

			if (user.verification_code !== verification_code)
				{return res
					.status(HttpStatusCode.NotFound)
					.json({ message: AUTH_MESSAGES.INACTIVE_ACCOUNT_ERROR });}

			if (user.status === StatusEnum.DISABLED) {
				return res.status(HttpStatusCode.Forbidden).json({
					message: AUTH_MESSAGES.ACCOUNT_LOCKED,
				});
			}
			await new UsersService().update(user.id, {
				verification_code: null,
				verification_code_ttl: null,
				confirmed: true,
			});

			return res.status(HttpStatusCode.Ok).json({
				message: AUTH_MESSAGES.CONGRATULATIONS,
			});
		} catch (error: any) {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: error.message,
			});
		}
	}

	async refreshToken(req: Request, res: Response) {
		try {
			const refreshToken: any = get(req, 'headers.x-refresh');
			const decoded = verifyJwt<{ email: string }>(refreshToken, 'refreshTokenPublicKey');

			if (!decoded)
				{return res.status(HttpStatusCode.NotFound).json({ msg: 'Refresh token failed' });}

			const existingUser = await new UsersRepo().getOne({ email: decoded.email });
			if (!existingUser)
				{return res
					.status(HttpStatusCode.NotFound)
					.json({ message: AUTH_MESSAGES.ACCOUNT_NOT_FOUND });}
			const accessToken = Authentication.generateToken(existingUser.id, existingUser.email);
			const newRefreshToken = Authentication.generateRefreshToken(
				existingUser.id,
				existingUser.email,
			);
			const refreshExpiresIn = convertExpireTimeToMilliseconds(
				env.JWT_REFRESH_EXPIRES_IN,
			);

			const expiresIn = new Date().setTime(new Date().getTime() + EXPIRE_TIME);

			return res.status(HttpStatusCode.Ok).json({
				accessToken: accessToken,
				refreshToken: newRefreshToken,
				refreshExpiresIn,
				expiresIn,
			});
		} catch {
			return res.status(HttpStatusCode.InternalServerError).json({
				message: AUTH_MESSAGES.SERVER_ERROR,
			});
		}
	}
}

export default new AuthenticationController();
