import { Permission } from '@shared/types';
import { TypeOf, z } from 'zod';

export const createAccessgroupTypeSchema = z.object({
	body: z.object({
		name: z.string().min(1, 'Le nom est requis'),
		permissions: z.array(z.nativeEnum(Permission)),
	}),
});

export const updateAccessgroupTypeSchema = z.object({
	body: createAccessgroupTypeSchema.shape.body.partial(),
});

export type CreateAccessGroupInput = TypeOf<typeof createAccessgroupTypeSchema>['body'];
export type UpdateAccessGroupInput = TypeOf<typeof updateAccessgroupTypeSchema>['body'];
