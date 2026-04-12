import { v4 as uuidv4 } from 'uuid';

/**
 * Génère un code aléatoire de la longueur spécifiée (par défaut 10 caractères)
 */
export const generateRandomCode = (length: number = 10): string => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
};

/**
 * Génère un UUID v4
 */
export const generateUUID = (): string => {
	return uuidv4();
};

/**
 * Convertit une durée sous forme de chaîne (ex: "30m", "1h", "7d") en millisecondes
 */
export const convertExpireTimeToMilliseconds = (expireTime: string): number => {
	const number = parseInt(expireTime.slice(0, -1));
	const unit = expireTime.slice(-1);
	switch (unit) {
		case 's':
			return number * 1000;
		case 'm':
			return number * 60 * 1000;
		case 'h':
			return number * 60 * 60 * 1000;
		case 'd':
			return number * 24 * 60 * 60 * 1000;
		default:
			return 0;
	}
};
