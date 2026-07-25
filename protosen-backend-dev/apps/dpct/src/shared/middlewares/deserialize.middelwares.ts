import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HttpStatusCode } from 'axios';
import { AUTH_MESSAGES } from '../../constants/messages/auth.messages';
import { verifyJwt } from '../libs/jwt/jwt';

class UserDeserializer {
	public async deserializeUser(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void | Response<any, Record<string, any>>> {
		const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');
		if (!accessToken) {return next();}

		const decoded = verifyJwt<JwtPayload>(accessToken, 'accessTokenPublicKey');

		//check if the token expired
		if (decoded && decoded.exp) {
			const isTokenExpired = new Date(decoded.exp * 1000) < new Date();
			res.locals.user = decoded;
			if (isTokenExpired) {
				return res.status(HttpStatusCode.Unauthorized).json({ msg: AUTH_MESSAGES.SESSION_EXPIRED });
			}
		}

		return next();
	}
}

export default new UserDeserializer().deserializeUser;
