import { TypeOf, z } from 'zod';

export const createCardTypeSchema = z.object({
	body: z.object({
		name: z.string().min(1, 'Le nom est requis'),
		observation: z.array(z.string()),
		description: z.string().optional(),
		color: z.string().max(50).optional(),
	}),
});

export const updateCardTypeSchema = z.object({
	body: createCardTypeSchema.shape.body.partial(),
});

export type CreateCardTypeInput = TypeOf<typeof createCardTypeSchema>['body'];
export type UpdateCardTypeInput = TypeOf<typeof updateCardTypeSchema>['body'];
