import { Router } from 'express';
import { multerConfig } from '@appconfig/multer';
import domesticAndRelativeDCController from './controllers/domesticAndRelative-card.controller';
import renewDomesticAndRelativeCardController from './controllers/domesticAndRelative-renew-card.controller';
import domesticAndRelativeDuplicataDCController from './controllers/domesticAndRelative-duplicata-card.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '@shared/middlewares/validateRessource.middlewares';
import * as DomesticAndRelativeDCSchemas from './dtos/domesticAndRelative-card.dto';
import * as RenewDomesticAndRelativeDCSchemas from './dtos/domesticAndRelative-renew.dto';
import {
	createDuplicaDCSchema,
	getsDuplicataDCsSchemas,
	printDomesticAndRelativeDuplicataDCSchema,
} from './dtos/domesticAndRelative-duplicata.dto';
import {
	deleteFileByIdSchema,
	attachFileDomesticAndRelativeDCByIdSchema,
} from '@shared/schemas/file.schema';
import {
	adminValidateDocSchema,
	getByIdSchema,
	superAdminValidateDocSchema,
} from '@shared/schemas/public.schemas';

const domesticAndRelativeRouter = Router();

// Configuration multer pour les fichiers
const upload = multerConfig.fields([
	{
		name: 'passport',
	},
	{
		name: 'ad',
	},
	{
		name: 'photo',
	},
	{
		name: 'others',
	},
]);

// ============================================
// Routes principales DomesticAndRelativeCard
// ============================================

domesticAndRelativeRouter.post(
	'/',
	authorizerMiddlewares.requireUser,
	validateInputResource(DomesticAndRelativeDCSchemas.createDomesticAndRelativeDCSchema),
	domesticAndRelativeDCController.create,
);

domesticAndRelativeRouter.get(
	'/',
	authorizerMiddlewares.requireUser,
	validateInputResource(DomesticAndRelativeDCSchemas.getDomesticAndRelativesDCSchemas),
	domesticAndRelativeDCController.getList,
);

domesticAndRelativeRouter.post(
	'/files',
	authorizerMiddlewares.requireUser,
	upload,
	validateInputResource(attachFileDomesticAndRelativeDCByIdSchema),
	domesticAndRelativeDCController.attachFiles,
);

domesticAndRelativeRouter.put(
	'/files',
	authorizerMiddlewares.requireUser,
	upload,
	validateInputResource(attachFileDomesticAndRelativeDCByIdSchema),
	domesticAndRelativeDCController.attachOtherFiles,
);

domesticAndRelativeRouter.patch(
	'/files/other/delete/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(deleteFileByIdSchema),
	domesticAndRelativeDCController.deleteOtherFiles,
);

domesticAndRelativeRouter.put(
	'/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	domesticAndRelativeDCController.pointFocalValidation,
);

domesticAndRelativeRouter.put(
	'/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	domesticAndRelativeDCController.adminValidation,
);

domesticAndRelativeRouter.put(
	'/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	domesticAndRelativeDCController.superadminValidation,
);

domesticAndRelativeRouter.patch(
	'/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(DomesticAndRelativeDCSchemas.printDomesticAndRelativeDCSchema),
	domesticAndRelativeDCController.setPrintDomesticAndRelativeDC,
);

domesticAndRelativeRouter.patch(
	'/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	domesticAndRelativeDCController.undoPrintDomesticAndRelativeDCC,
);

domesticAndRelativeRouter.patch(
	'/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	domesticAndRelativeDCController.setReturned,
);

// ============================================
// Routes Renew DomesticAndRelativeCard
// ============================================

domesticAndRelativeRouter.get(
	'/renew/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewDomesticAndRelativeDCSchemas.renewDomesticAndRelativeDCByIdSchema),
	renewDomesticAndRelativeCardController.getDomesticAndRelativeCard,
);

domesticAndRelativeRouter.get(
	'/renew',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewDomesticAndRelativeDCSchemas.getRenewDomesticAndRelativesDCSchemas),
	renewDomesticAndRelativeCardController.getDomesticAndRelativesDC,
);

domesticAndRelativeRouter.post(
	'/renew/create/:id',
	authorizerMiddlewares.requireUser,
	renewDomesticAndRelativeCardController.createRenewal,
);

domesticAndRelativeRouter.put(
	'/renew/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	renewDomesticAndRelativeCardController.pointFocalValidation,
);

domesticAndRelativeRouter.put(
	'/renew/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	renewDomesticAndRelativeCardController.adminValidation,
);

domesticAndRelativeRouter.put(
	'/renew/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	renewDomesticAndRelativeCardController.superAdminValidation,
);

domesticAndRelativeRouter.patch(
	'/renew/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(
		RenewDomesticAndRelativeDCSchemas.setPrintedRenewDomesticAndRelativeDCSchema,
	),
	renewDomesticAndRelativeCardController.setPrintedRenewDomesticAndRelativeDC,
);

domesticAndRelativeRouter.patch(
	'/renew/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	renewDomesticAndRelativeCardController.undoPrintRenewDomesticAndRelativeDC,
);

domesticAndRelativeRouter.patch(
	'/renew/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	renewDomesticAndRelativeCardController.setReturned,
);

// ============================================
// Routes Duplicata DomesticAndRelativeCard
// ============================================

domesticAndRelativeRouter.post(
	'/duplicata',
	authorizerMiddlewares.requireUser,
	validateInputResource(createDuplicaDCSchema),
	domesticAndRelativeDuplicataDCController.demandDuplicataCard,
);

domesticAndRelativeRouter.get(
	'/duplicata',
	authorizerMiddlewares.requireUser,
	validateInputResource(getsDuplicataDCsSchemas),
	domesticAndRelativeDuplicataDCController.getDomesticAndRelativesDuplicataDC,
);

domesticAndRelativeRouter.get(
	'/duplicata/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	domesticAndRelativeDuplicataDCController.getDomesticAndRelativeDuplicataDC,
);

domesticAndRelativeRouter.put(
	'/duplicata/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	domesticAndRelativeDuplicataDCController.pointFocalValidation,
);

domesticAndRelativeRouter.put(
	'/duplicata/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	domesticAndRelativeDuplicataDCController.adminValidation,
);

domesticAndRelativeRouter.put(
	'/duplicata/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	domesticAndRelativeDuplicataDCController.superAdminValidation,
);

domesticAndRelativeRouter.patch(
	'/duplicata/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(printDomesticAndRelativeDuplicataDCSchema),
	domesticAndRelativeDuplicataDCController.setPrintedDomesticAndRelativeDuplicataDC,
);

domesticAndRelativeRouter.patch(
	'/duplicata/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	domesticAndRelativeDuplicataDCController.undoPrintDomesticAndRelativeDuplicataDC,
);

domesticAndRelativeRouter.patch(
	'/duplicata/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	domesticAndRelativeDuplicataDCController.setReturned,
);

domesticAndRelativeRouter.patch(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(DomesticAndRelativeDCSchemas.updateDomesticAndRelativeDCSchema),
	domesticAndRelativeDCController.update,
);
domesticAndRelativeRouter.delete(
	'/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	domesticAndRelativeDCController.deleteDomesticAndRelativeDC,
);
domesticAndRelativeRouter.get(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(DomesticAndRelativeDCSchemas.domesticAndRelativeDCByIdSchema),
	domesticAndRelativeDCController.getById,
);

export default domesticAndRelativeRouter;
