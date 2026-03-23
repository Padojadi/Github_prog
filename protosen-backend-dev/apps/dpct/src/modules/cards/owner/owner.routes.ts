import { Router } from 'express';
import ownerDCController from './controllers/owner-card.controller';
import renewOwnerCardController from './controllers/owner-renew-card.controller';
import ownerDuplicataDCController from './controllers/owner-duplicata-card.controller';
import authorizerMiddlewares from '../../../shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '../../../shared/middlewares/validateRessource.middlewares';
import * as OwnerDCSchemas from './dtos/owner-card.dto';
import * as RenewOwnerDCSchemas from './dtos/owner-renew.dto';
import {
	createDuplicaDCSchema,
	getsDuplicataDCsSchemas,
	printOwnerDuplicataDCSchema,
} from './dtos/owner-duplicata.dto';
import {
	attachFileOwnerDCByIdSchema,
	deleteFileByIdSchema,
	generatePresignedUrlSchema,
} from '@shared/schemas/file.schema';
import {
	adminValidateDocSchema,
	getByIdSchema,
	superAdminValidateDocSchema,
} from '@shared/schemas/public.schemas';
import { multerConfig } from '@appconfig/multer';

const ownerRouter = Router();

// Configuration multer pour les fichiers
const upload = multerConfig.fields([
	{
		name: 'passport',
	},
	{
		name: 'lc',
	},
	{
		name: 'photo',
	},
	{
		name: 'others',
	},
]);

// ============================================
// Routes principales OwnerCard
// ============================================

ownerRouter.post(
	'/',
	authorizerMiddlewares.requireUser,
	validateInputResource(OwnerDCSchemas.createOwnerDCSchema),
	ownerDCController.create,
);

ownerRouter.get(
	'/',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(OwnerDCSchemas.getOwnersDCSchemas),
	ownerDCController.getOwnersDC,
);

ownerRouter.get(
	'/admin/list',
	authorizerMiddlewares.requireUser,
	validateInputResource(OwnerDCSchemas.getOwnersDCSchemas),
	ownerDCController.getOwnersDCAsAdmin,
);

ownerRouter.post(
	'/upload-url',
	authorizerMiddlewares.requireUser,
	validateInputResource(generatePresignedUrlSchema),
	ownerDCController.generatePresignedUrl,
);

ownerRouter.post(
	'/files',
	authorizerMiddlewares.requireUser,
	upload,
	validateInputResource(attachFileOwnerDCByIdSchema),
	ownerDCController.attachFiles,
);

ownerRouter.put(
	'/files',
	authorizerMiddlewares.requireUser,
	upload,
	validateInputResource(attachFileOwnerDCByIdSchema),
	ownerDCController.attachOtherFiles,
);

ownerRouter.patch(
	'/files/other/delete/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(deleteFileByIdSchema),
	ownerDCController.deleteOtherFiles,
);

ownerRouter.put(
	'/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	ownerDCController.pointFocalValidation,
);

ownerRouter.put(
	'/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	ownerDCController.adminValidation,
);

ownerRouter.patch(
	'/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(OwnerDCSchemas.printOwnerDCSchema),
	ownerDCController.setPrintOwnerDC,
);

ownerRouter.patch(
	'/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	ownerDCController.undoPrintOwnerDC,
);

ownerRouter.patch(
	'/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	ownerDCController.setReturned,
);

ownerRouter.put(
	'/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	ownerDCController.superAdminValidation,
);

// ============================================
// Routes Renew OwnerCard
// ============================================

ownerRouter.get(
	'/renew',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(RenewOwnerDCSchemas.getRenewOwnersDCSchemas),
	renewOwnerCardController.getOwnersDC,
);

ownerRouter.get(
	'/renew/admin/list',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewOwnerDCSchemas.getRenewOwnersDCSchemas),
	renewOwnerCardController.getOwnersDCAsAdmin,
);

ownerRouter.post(
	'/renew/create/:id',
	authorizerMiddlewares.requireUser,
	renewOwnerCardController.createRenewal,
);

ownerRouter.put(
	'/renew/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	renewOwnerCardController.pointFocalValidation,
);

ownerRouter.put(
	'/renew/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	renewOwnerCardController.adminValidation,
);

ownerRouter.put(
	'/renew/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	renewOwnerCardController.superAdminValidation,
);

ownerRouter.patch(
	'/renew/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewOwnerDCSchemas.setPrintedRenewOwnerDCSchema),
	renewOwnerCardController.setPrintedRenewOwnerDC,
);

ownerRouter.patch(
	'/renew/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	renewOwnerCardController.undoPrintRenewOwnerDC,
);

ownerRouter.patch(
	'/renew/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	renewOwnerCardController.setReturned,
);

ownerRouter.get(
	'/renew/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewOwnerDCSchemas.renewOwnerDCByIdSchema),
	renewOwnerCardController.getOwnerCard,
);

// ============================================
// Routes Duplicata OwnerCard
// ============================================

ownerRouter.post(
	'/duplicata',
	authorizerMiddlewares.requireUser,
	validateInputResource(createDuplicaDCSchema),
	ownerDuplicataDCController.demandDuplicataCard,
);

ownerRouter.get(
	'/duplicata',
	authorizerMiddlewares.requireUser,
	validateInputResource(getsDuplicataDCsSchemas),
	ownerDuplicataDCController.getOwnersDuplicataDC,
);

ownerRouter.get(
	'/duplicata/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	ownerDuplicataDCController.getOwnerDuplicactaDC,
);

ownerRouter.put(
	'/duplicata/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	ownerDuplicataDCController.pointFocalValidation,
);

ownerRouter.put(
	'/duplicata/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	ownerDuplicataDCController.adminValidation,
);

ownerRouter.put(
	'/duplicata/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	ownerDuplicataDCController.superAdminValidation,
);

ownerRouter.patch(
	'/duplicata/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(printOwnerDuplicataDCSchema),
	ownerDuplicataDCController.setPrintedOwnerDuplicataDC,
);

ownerRouter.patch(
	'/duplicata/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	ownerDuplicataDCController.undoPrintOwnerDuplicataDC,
);

ownerRouter.patch(
	'/duplicata/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	ownerDuplicataDCController.setReturned,
);

// ============================================
// Routes for specific owner cards (must come after /renew/duplicatas routes)
// ============================================

ownerRouter.patch(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(OwnerDCSchemas.updateOwnerDCSchema),
	ownerDCController.updateOwnerDC,
);

ownerRouter.put(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(OwnerDCSchemas.updateOwnerDCSchema.strict()),
	ownerDCController.updateOwnerDC,
);

ownerRouter.delete(
	'/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	ownerDCController.deleteOwnerDC,
);

ownerRouter.get(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(OwnerDCSchemas.ownerDCByIdSchema),
	ownerDCController.getOwnerCard,
);

export default ownerRouter;
