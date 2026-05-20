import { Router } from 'express';
import childDCController from './controllers/child-card.controller';
import renewChildCardController from './controllers/child-renew-card.controller';
import childDuplicataDCController from './controllers/child-duplicata-card.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '@shared/middlewares/validateRessource.middlewares';
import * as ChildDCSchemas from './dtos/child-card.dto';
import * as RenewChildDCSchemas from './dtos/child-renew.dto';
import {
	createDuplicaDCSchema,
	getsDuplicataDCsSchemas,
	printChildDuplicataDCSchema,
} from './dtos/child-duplicata.dto';
import { deleteFileByIdSchema, attachFileChildDCByIdSchema } from '@shared/schemas/file.schema';
import {
	adminValidateDocSchema,
	getByIdSchema,
	superAdminValidateDocSchema,
} from '@shared/schemas/public.schemas';
import { multerConfig } from '@appconfig/multer';

const childRouter = Router();

// Configuration multer pour les fichiers
const upload = multerConfig.fields([
	{
		name: 'passport',
	},
	{
		name: 'an',
	},
	{
		name: 'photo',
	},
	{
		name: 'others',
	},
]);

// ============================================
// Routes principales ChildCard
// ============================================

childRouter.post(
	'/',
	authorizerMiddlewares.requireUser,
	validateInputResource(ChildDCSchemas.createChildDCSchema),
	childDCController.create,
);

childRouter.get(
	'/',
	authorizerMiddlewares.requireUser,
	validateInputResource(ChildDCSchemas.getChildsDCSchemas),
	childDCController.getChildsDC,
);

childRouter.post(
	'/files',
	authorizerMiddlewares.requireUser,
	upload,
	validateInputResource(attachFileChildDCByIdSchema),
	childDCController.attachFiles,
);

childRouter.put(
	'/files',
	authorizerMiddlewares.requireUser,
	upload,
	validateInputResource(attachFileChildDCByIdSchema),
	childDCController.attachOtherFiles,
);

childRouter.patch(
	'/files/other/delete/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(deleteFileByIdSchema),
	childDCController.deleteOtherFiles,
);

childRouter.put(
	'/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	childDCController.pointFocalValidation,
);

childRouter.put(
	'/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	childDCController.adminValidation,
);

childRouter.put(
	'/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	childDCController.superAdminValidation,
);

childRouter.patch(
	'/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(ChildDCSchemas.printChildDCSchema),
	childDCController.setPrintChildDC,
);

childRouter.patch(
	'/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	childDCController.undoPrintChildDC,
);

childRouter.patch(
	'/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	childDCController.setReturned,
);

// ============================================
// Routes Renew ChildCard
// ============================================

childRouter.get(
	'/renew',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewChildDCSchemas.getRenewChildsDCSchemas),
	renewChildCardController.getChildsDC,
);

childRouter.post(
	'/renew/create/:id',
	authorizerMiddlewares.requireUser,
	renewChildCardController.createRenewal,
);

childRouter.put(
	'/renew/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	renewChildCardController.pointFocalValidation,
);

childRouter.put(
	'/renew/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	renewChildCardController.adminValidation,
);

childRouter.put(
	'/renew/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	renewChildCardController.superAdminValidation,
);

childRouter.patch(
	'/renew/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewChildDCSchemas.setPrintedRenewChildDCSchema),
	renewChildCardController.setPrintedRenewChildDC,
);

childRouter.patch(
	'/renew/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	renewChildCardController.undoPrintRenewChildDC,
);

childRouter.patch(
	'/renew/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	renewChildCardController.setReturned,
);

childRouter.get(
	'/renew/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewChildDCSchemas.renewChildDCByIdSchema),
	renewChildCardController.getChildCard,
);

// ============================================
// Routes Duplicata ChildCard
// ============================================

childRouter.post(
	'/duplicata',
	authorizerMiddlewares.requireUser,
	validateInputResource(createDuplicaDCSchema),
	childDuplicataDCController.demandDuplicataCard,
);

childRouter.get(
	'/duplicata',
	authorizerMiddlewares.requireUser,
	validateInputResource(getsDuplicataDCsSchemas),
	childDuplicataDCController.getChildsDuplicataDC,
);

childRouter.get(
	'/duplicata/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	childDuplicataDCController.getChildDuplicataDC,
);

childRouter.put(
	'/duplicata/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	childDuplicataDCController.pointFocalValidation,
);

childRouter.put(
	'/duplicata/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	childDuplicataDCController.adminValidation,
);

childRouter.put(
	'/duplicata/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	childDuplicataDCController.superAdminValidation,
);

childRouter.patch(
	'/duplicata/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(printChildDuplicataDCSchema),
	childDuplicataDCController.setPrintedChildDuplicataDC,
);

childRouter.patch(
	'/duplicata/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	childDuplicataDCController.undoPrintChildDuplicataDC,
);

childRouter.patch(
	'/duplicata/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	childDuplicataDCController.setReturned,
);

childRouter.patch(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(ChildDCSchemas.updateChildDCSchema),
	childDCController.updateChildDC,
);
childRouter.delete(
	'/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	childDCController.deleteChildDC,
);
childRouter.get(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(ChildDCSchemas.ChildDCByIdSchema),
	childDCController.getChildDC,
);

export default childRouter;
