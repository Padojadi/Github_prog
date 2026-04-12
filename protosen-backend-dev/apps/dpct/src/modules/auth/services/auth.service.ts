import { AUTH_MESSAGES } from '../../../constants/messages/auth.messages';
import { UsersRepo } from '../../user/repositories/user.repository';
import Authentication from '../../../shared/utils/auth.util';
import sendEmail from '../../../shared/utils/mailer';
import * as UserTypes from '../../user/types/user.types';
import env from '@appconfig/env.config';
import { convertExpireTimeToMilliseconds } from '../../../shared/utils/functions';

const EXPIRE_TIME = convertExpireTimeToMilliseconds(env.JWT_EXPIRES_IN);

interface IAuthenticationService {
	login(
		email: string,
		password: string,
		candidatePassword: string,
		id: string,
	): Promise<Record<string, string | number>>;

	register(data: UserTypes.IRegisterUser): Promise<void>;

	registerSuperAdmin(data: UserTypes.ISuperAdminRegisterUser): Promise<void>;
}

export class AuthenticationService implements IAuthenticationService {
	async login(
		email: string,
		password: string,
		candidatePassword: string,
		id: string,
	): Promise<Record<string, string | number>> {
		// check password
		const compare = await Authentication.passwordCompare(password, candidatePassword);

		// generate tokens
		if (compare) {
			const expiresIn = new Date().setTime(new Date().getTime() + EXPIRE_TIME);
			const accessToken = Authentication.generateToken(id, email);
			const refreshToken = Authentication.generateRefreshToken(id, email);
			return { accessToken, refreshToken, expiresIn };
		}
		return {};
	}

	async register(data: UserTypes.IRegisterUser): Promise<void> {
		const hashedPassword: string = await Authentication.passwordHash(data.password);
		data.password = hashedPassword;

		const response = await new UsersRepo().save({ ...data, confirmed: true });
		await sendEmail({
			from: 'test@email.com',
			to: response.email,
			subject: AUTH_MESSAGES.ACCOUNT_CREATED,
			text:
				AUTH_MESSAGES.REGISTRATION_COMPLETED +
				`, voici votre code de verification ${response.verification_code}`,
		});
	}
	async registerSuperAdmin(data: UserTypes.ISuperAdminRegisterUser): Promise<void> {
		const hashedPassword: string = await Authentication.passwordHash(data.password);
		data.password = hashedPassword;

		const response = await new UsersRepo().saveSup({ ...data, confirmed: true });
		await sendEmail({
			from: 'test@email.com',
			to: response.email,
			subject: AUTH_MESSAGES.ACCOUNT_CREATED,
			text:
				AUTH_MESSAGES.REGISTRATION_COMPLETED +
				`, voici votre code de verification ${response.verification_code}`,
		});
	}
}
