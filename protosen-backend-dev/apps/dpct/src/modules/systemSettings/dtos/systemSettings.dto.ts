import { TypeOf, z } from 'zod';

// Validation pour image base64
const MAX_IMAGE_SIZE_KB = 512;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

const base64ImageSchema = z
	.string()
	.refine(
		(val) => {
			if (!val) {return true;}
			// Vérifie le format data URI ou base64 pur
			const dataUriRegex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
			return dataUriRegex.test(val) || /^[A-Za-z0-9+/=]+$/.test(val);
		},
		{ message: 'La signature doit être une image encodée en base64 valide' },
	)
	.refine(
		(val) => {
			if (!val) {return true;}
			// Extrait la partie base64 (sans le préfixe data URI si présent)
			const base64Data = val.includes(',') ? val.split(',')[1] : val;
			// Calcule la taille en bytes: (longueur base64 * 3/4) - padding
			const padding = (base64Data.match(/=+$/) || [''])[0].length;
			const sizeInBytes = (base64Data.length * 3) / 4 - padding;
			return sizeInBytes <= MAX_IMAGE_SIZE_BYTES;
		},
		{ message: `La signature ne doit pas dépasser ${MAX_IMAGE_SIZE_KB}KB` },
	)
	.optional()
	.nullable();

export const updateSystemSettingsSchema = z.object({
	body: z.object({
		directorSignature: base64ImageSchema,
		ministryName: z
			.string()
			.max(500, 'Le nom du ministère ne peut pas dépasser 500 caractères')
			.optional()
			.nullable(),
		protocolDirectionName: z
			.string()
			.max(500, 'Le nom de la direction ne peut pas dépasser 500 caractères')
			.optional()
			.nullable(),
	}),
});

export type UpdateSystemSettingsInput = TypeOf<typeof updateSystemSettingsSchema>['body'];
