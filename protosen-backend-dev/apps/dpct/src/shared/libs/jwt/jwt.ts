import jwt from 'jsonwebtoken';
import log from '@shared/utils/logger';
import env from '@appconfig/env.config';

export const signJwt = (
	object: object,
	keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
	options?: jwt.SignOptions,
): string => {
	const keyValue = keyName === 'accessTokenPrivateKey'
		? env.ACCESS_TOKEN_PRIVATE_KEY
		: env.REFRESH_PRIVATE_KEY;
	const signingKey = Buffer.from(keyValue, 'base64').toString('ascii');
	return jwt.sign(object, signingKey, {
		...options,
		algorithm: 'RS256',
	});
};

export function verifyJwt<T>(
	token: string,
	keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey',
): T | null {
	const payload =
		keyName === 'accessTokenPublicKey'
			? process.env.ACCESS_TOKEN_PUBLIC_KEY
			: process.env.REFRESH_PUBLIC_KEY;

	if (!payload) {
		log.error({ keyName }, 'JWT public key not configured');
		return null;
	}

	const publicKey = Buffer.from(payload, 'base64').toString('ascii');

	try {
		const decoded = jwt.verify(token, publicKey) as T;
		return decoded;
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			log.warn({ keyName }, 'JWT token expired');
		} else if (error instanceof jwt.JsonWebTokenError) {
			log.warn({ keyName, error: (error as Error).message }, 'JWT verification failed');
		} else {
			log.error({ keyName, error }, 'Unexpected JWT verification error');
		}
		return null;
	}
}
