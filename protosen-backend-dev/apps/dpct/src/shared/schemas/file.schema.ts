import { object, string, TypeOf } from 'zod';

export const attachFileOwnerDCByIdSchema = object({
	body: object({
		ownerDiplomaticCardId: string().uuid(),
	}),
});

export const generatePresignedUrlSchema = object({
	body: object({
		fileName: string(),
		fileType: string(),
	}),
});

export const attachFileSpouseDCByIdSchema = object({
	body: object({
		spouseDCId: string().uuid(),
	}).strict(),
});

export const attachFileChildDCByIdSchema = object({
	body: object({
		childDCId: string().uuid(),
	}).strict(),
});

export const attachFileOtherDependantDCByIdSchema = object({
	body: object({
		otherDependantDCId: string().uuid(),
	}).strict(),
});

export const attachFileDomesticAndRelativeDCByIdSchema = object({
	body: object({
		domesticAndRelativeDCId: string().uuid(),
	}).strict(),
});

export const attachFileOtherStaffDCByIdSchema = object({
	body: object({
		otherStaffDCId: string().uuid(),
	}).strict(),
});

export const deleteFileByIdSchema = object({
	params: object({
		id: string().uuid(),
	}).strict(),
	body: object({
		fileKeys: string().min(1).max(200).array().nonempty(),
	}),
});

export type GeneratePresignedURLInput = TypeOf<typeof generatePresignedUrlSchema>['body'];

export type AttachFileOwnerDCInput = TypeOf<typeof attachFileOwnerDCByIdSchema>['body'];

export type AttachFileSpouseDCInput = TypeOf<typeof attachFileSpouseDCByIdSchema>['body'];

export type AttachFileChildDCInput = TypeOf<typeof attachFileChildDCByIdSchema>['body'];

export type AttachFileOtherDependantDCInput = TypeOf<
	typeof attachFileOtherDependantDCByIdSchema
>['body'];

export type AttachFileDomesticAndRelativeDCInput = TypeOf<
	typeof attachFileDomesticAndRelativeDCByIdSchema
>['body'];

export type AttachFileOtherStaffDCInput = TypeOf<typeof attachFileOtherStaffDCByIdSchema>['body'];

export type DeleteFileInput = TypeOf<typeof deleteFileByIdSchema>;
