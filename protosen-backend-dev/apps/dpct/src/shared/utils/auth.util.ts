import argon2 from 'argon2';
import { signJwt, verifyJwt } from '../libs/jwt/jwt';
import { JwtPayload } from 'jsonwebtoken';

interface Payload {
	id: string;
	email: string;
}

class Authentication {
	public static passwordHash(password: string): Promise<string> {
		return argon2.hash(password);
	}

	public static async passwordCompare(text: string, encryptedText: string): Promise<boolean> {
		return await argon2.verify(encryptedText, text);
	}

	//Generate access token
	public static generateToken(id: string, email: string): string {
		const payload: Payload = {
			id: id,
			email: email,
		};

		const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
			expiresIn: process.env.JWT_EXPIRES_IN as any,
		});
		return accessToken;
	}

	//Generate refresh token
	public static generateRefreshToken(id: string, email: string): string {
		const payload: Payload = {
			id: id,
			email: email,
		};
		const refreshToken = signJwt(payload, 'refreshTokenPrivateKey', {
			expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as any,
		});
		return refreshToken;
	}

	// Validate token
	public static validateToken(token: string): JwtPayload | null {
		try {
			const decoded = verifyJwt<JwtPayload>(token, 'accessTokenPublicKey');
			return decoded;
		} catch {
			return null;
		}
	}
}

export default Authentication;
