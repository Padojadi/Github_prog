import { TypeOf, z } from 'zod';

export const createPlaqueSchema = z.object({
	body: z.object({
		code: z
			.string()
			.min(1, 'Le code est requis')
			.max(4, 'Le code ne doit pas dépasser 4 caractères'),
		title: z.string().min(1, 'Le titre est requis'),
	}),
});

export const updatePlaqueSchema = z.object({
	body: createPlaqueSchema.shape.body.partial(),
});

export type CreatePlaqueInput = TypeOf<typeof createPlaqueSchema>['body'];
export type UpdatePlaqueInput = TypeOf<typeof updatePlaqueSchema>['body'];
