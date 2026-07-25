import { Router } from 'express';
import otherDependantDCController from './controllers/otherDependant-card.controller';
import renewOtherDependantCardController from './controllers/otherDependant-renew-card.controller';
import otherDependantDuplicataDCController from './controllers/otherDependant-duplicata-card.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '@shared/middlewares/validateRessource.middlewares';
import * as OtherDependantDCSchemas from './dtos/otherDependant-card.dto';
import * as RenewOtherDependantDCSchemas from './dtos/otherDependant-renew.dto';
import {
	createDuplicaDCSchema,
	getsDuplicataDCsSchemas,
	printOtherDependantDuplicataDCSchema,
} from './dtos/otherDependant-duplicata.dto';
import {
	deleteFileByIdSchema,
	attachFileOtherDependantDCByIdSchema,
} from '@shared/schemas/file.schema';
import {
	adminValidateDocSchema,
	getByIdSchema,
	superAdminValidateDocSchema,
} from '@shared/schemas/public.schemas';
import { multerConfig } from '@appconfig/multer';

const otherDependantRouter = Router();

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
// Routes principales OtherDependantCard
// ============================================

otherDependantRouter.post(
	'/',
	authorizerMiddlewares.requireUser,
	validateInputResource(OtherDependantDCSchemas.createOtherDependantDCSchema),
	otherDependantDCController.create,
);

otherDependantRouter.get(
	'/',
	authorizerMiddlewares.requireUser,
	validateInputResource(OtherDependantDCSchemas.getOtherDependantsDCSchemas),
	otherDependantDCController.getList,
);

otherDependantRouter.post(
	'/files',
	authorizerMiddlewares.requireUser,
	upload,
	validateInputResource(attachFileOtherDependantDCByIdSchema),
	otherDependantDCController.attachFiles,
);

otherDependantRouter.put(
	'/files',
	authorizerMiddlewares.requireUser,
	upload,
	validateInputResource(attachFileOtherDependantDCByIdSchema),
	otherDependantDCController.attachOtherFiles,
);

otherDependantRouter.patch(
	'/files/other/delete/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(deleteFileByIdSchema),
	otherDependantDCController.deleteOtherFiles,
);

otherDependantRouter.put(
	'/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	otherDependantDCController.pointFocalValidation,
);

otherDependantRouter.put(
	'/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	otherDependantDCController.adminValidation,
);

otherDependantRouter.put(
	'/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	otherDependantDCController.superAdminValidation,
);

otherDependantRouter.patch(
	'/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(OtherDependantDCSchemas.printOtherDependantDCSchema),
	otherDependantDCController.setPrintOtherDependantDC,
);

otherDependantRouter.patch(
	'/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	otherDependantDCController.undoOtherDependantDC,
);

otherDependantRouter.patch(
	'/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	otherDependantDCController.setReturned,
);

// ============================================
// Routes Renew OtherDependantCard
// ============================================

otherDependantRouter.get(
	'/renew/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewOtherDependantDCSchemas.renewOtherDependantDCByIdSchema),
	renewOtherDependantCardController.getOtherDependantCard,
);

otherDependantRouter.get(
	'/renew',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewOtherDependantDCSchemas.getRenewOtherDependantsDCSchemas),
	renewOtherDependantCardController.getOtherDependantsDC,
);

otherDependantRouter.post(
	'/renew/create/:id',
	authorizerMiddlewares.requireUser,
	renewOtherDependantCardController.createRenewal,
);

otherDependantRouter.put(
	'/renew/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	renewOtherDependantCardController.pointFocalValidation,
);

otherDependantRouter.put(
	'/renew/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	renewOtherDependantCardController.adminValidation,
);

otherDependantRouter.put(
	'/renew/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	renewOtherDependantCardController.superAdminValidation,
);

otherDependantRouter.patch(
	'/renew/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewOtherDependantDCSchemas.setPrintedRenewOtherDependantDCSchema),
	renewOtherDependantCardController.setPrintedRenewOtherDependantDC,
);

otherDependantRouter.patch(
	'/renew/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	renewOtherDependantCardController.undoPrintRenewOtherDependantDC,
);

otherDependantRouter.patch(
	'/renew/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	renewOtherDependantCardController.setReturned,
);

// ============================================
// Routes Duplicata OtherDependantCard
// ============================================

otherDependantRouter.post(
	'/duplicata',
	authorizerMiddlewares.requireUser,
	validateInputResource(createDuplicaDCSchema),
	otherDependantDuplicataDCController.demandDuplicataCard,
);

otherDependantRouter.get(
	'/duplicata',
	authorizerMiddlewares.requireUser,
	validateInputResource(getsDuplicataDCsSchemas),
	otherDependantDuplicataDCController.getOtherDependantsDuplicataDC,
);

otherDependantRouter.get(
	'/duplicata/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	otherDependantDuplicataDCController.getOtherDependantDuplicataDC,
);

otherDependantRouter.put(
	'/duplicata/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	otherDependantDuplicataDCController.pointFocalValidation,
);

otherDependantRouter.put(
	'/duplicata/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	otherDependantDuplicataDCController.adminValidation,
);

otherDependantRouter.put(
	'/duplicata/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	otherDependantDuplicataDCController.superAdminValidation,
);

otherDependantRouter.patch(
	'/duplicata/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(printOtherDependantDuplicataDCSchema),
	otherDependantDuplicataDCController.setPrintedOtherDependantDuplicataDC,
);

otherDependantRouter.patch(
	'/duplicata/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	otherDependantDuplicataDCController.undoPrintOtherDependantDuplicataDC,
);

otherDependantRouter.patch(
	'/duplicata/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	otherDependantDuplicataDCController.setReturned,
);

otherDependantRouter.patch(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(OtherDependantDCSchemas.updateOtherDependantDCSchema),
	otherDependantDCController.update,
);
otherDependantRouter.delete(
	'/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	otherDependantDCController.deleteOtherDependantDC,
);
otherDependantRouter.get(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(OtherDependantDCSchemas.otherDependantDCByIdSchema),
	otherDependantDCController.getById,
);

export default otherDependantRouter;
