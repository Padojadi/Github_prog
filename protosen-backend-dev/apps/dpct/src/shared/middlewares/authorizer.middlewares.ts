import { Response, Request, NextFunction } from 'express';
import { HttpStatusCode } from 'axios';
import { StatusEnum } from '../types';
import { UsersRepo } from '@modules/user/repositories/user.repository';
import { RoleEnum } from '@modules/user/types/user.types';
import { AUTH_MESSAGES } from 'src/constants';

class Authorizer {
	public async requireUser(req: Request, res: Response, next: NextFunction) {
		const user = res.locals.user;
		if (!user)
			{return res.status(HttpStatusCode.Unauthorized).json({ msg: AUTH_MESSAGES.LOGIN_REQUIRED });}

		const existingUser = await new UsersRepo().getById(user.id);

		if (!existingUser || !existingUser.confirmed || existingUser.status === StatusEnum.DISABLED) {
			return res.status(HttpStatusCode.Unauthorized).json({ msg: AUTH_MESSAGES.ACCESS_DENIED });
		}

		res.locals.userAuth = existingUser;
		return next();
	}

	public async superAdminAuthorizer(req: Request, res: Response, next: NextFunction) {
		const user = res.locals.user;

		if (!user)
			{return res.status(HttpStatusCode.Forbidden).json({ msg: AUTH_MESSAGES.LOGIN_REQUIRED });}

		const existingUser = await new UsersRepo().getById(user.id);

		if (!existingUser || !existingUser.confirmed || existingUser.status === StatusEnum.DISABLED) {
			return res.status(HttpStatusCode.Forbidden).json({ msg: AUTH_MESSAGES.ACCESS_DENIED });
		}

		if (existingUser.role !== RoleEnum.SUPERADMIN) {
			return res.status(HttpStatusCode.Forbidden).json({ msg: AUTH_MESSAGES.ACCESS_DENIED });
		}
		res.locals.userAuth = existingUser;
		return next();
	}

	public async adminAuthorizer(req: Request, res: Response, next: NextFunction) {
		const user = res.locals.user;
		if (!user)
			{return res.status(HttpStatusCode.Forbidden).json({ msg: AUTH_MESSAGES.LOGIN_REQUIRED });}

		const existingUser = await new UsersRepo().getById(user.id);

		if (!existingUser || !existingUser.confirmed || existingUser.status === StatusEnum.DISABLED) {
			return res.status(HttpStatusCode.Forbidden).json({ msg: AUTH_MESSAGES.ACCESS_DENIED });
		}

		if (existingUser.role === RoleEnum.ADMIN || existingUser.role === RoleEnum.SUPERADMIN) {
			res.locals.userAuth = existingUser;
			return next();
		}
		return res.status(HttpStatusCode.Forbidden).json({ msg: AUTH_MESSAGES.ACCESS_DENIED });
	}
}

export default new Authorizer();
