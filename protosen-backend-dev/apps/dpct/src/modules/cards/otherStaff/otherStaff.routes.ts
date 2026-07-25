import { Router } from 'express';
import otherStaffDCController from './controllers/otherStaff-card.controller';
import renewOtherStaffCardController from './controllers/otherStaff-renew-card.controller';
import otherStaffDuplicataDCController from './controllers/otherStaff-duplicata-card.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '@shared/middlewares/validateRessource.middlewares';
import * as OtherStaffDCSchemas from './dtos/otherStaff-card.dto';
import * as RenewOtherStaffDCSchemas from './dtos/otherStaff-renew.dto';
import {
	createDuplicaDCSchema,
	getsDuplicataDCsSchemas,
	printOtherStaffDuplicataDCSchema,
} from './dtos/otherStaff-duplicata.dto';
import {
	deleteFileByIdSchema,
	attachFileOtherStaffDCByIdSchema,
} from '@shared/schemas/file.schema';
import {
	adminValidateDocSchema,
	getByIdSchema,
	superAdminValidateDocSchema,
} from '@shared/schemas/public.schemas';
import { multerConfig } from '@appconfig/multer';

const otherStaffRouter = Router();

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
// Routes principales OtherStaffCard
// ============================================

otherStaffRouter.post(
	'/',
	authorizerMiddlewares.requireUser,
	validateInputResource(OtherStaffDCSchemas.createOtherStaffDCSchema),
	otherStaffDCController.create,
);

otherStaffRouter.get(
	'/',
	authorizerMiddlewares.requireUser,
	validateInputResource(OtherStaffDCSchemas.getOtherStaffsDCSchemas),
	otherStaffDCController.getList,
);

otherStaffRouter.post(
	'/files',
	authorizerMiddlewares.requireUser,
	upload,
	validateInputResource(attachFileOtherStaffDCByIdSchema),
	otherStaffDCController.attachFiles,
);

otherStaffRouter.put(
	'/files',
	authorizerMiddlewares.requireUser,
	upload,
	validateInputResource(attachFileOtherStaffDCByIdSchema),
	otherStaffDCController.attachOtherFiles,
);

otherStaffRouter.patch(
	'/files/other/delete/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(deleteFileByIdSchema),
	otherStaffDCController.deleteOtherFiles,
);

otherStaffRouter.put(
	'/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	otherStaffDCController.pointFocalValidation,
);

otherStaffRouter.put(
	'/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	otherStaffDCController.adminValidation,
);

otherStaffRouter.put(
	'/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	otherStaffDCController.superAdminValidation,
);

otherStaffRouter.patch(
	'/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(OtherStaffDCSchemas.printOtherStaffDCSchema),
	otherStaffDCController.setPrintOtherStaffDC,
);

otherStaffRouter.patch(
	'/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	otherStaffDCController.undoOtherStaffChildDC,
);

otherStaffRouter.patch(
	'/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	otherStaffDCController.setReturned,
);

// ============================================
// Routes Renew OtherStaffCard
// ============================================

otherStaffRouter.get(
	'/renew/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewOtherStaffDCSchemas.renewOtherStaffDCByIdSchema),
	renewOtherStaffCardController.getOtherStaffCard,
);

otherStaffRouter.get(
	'/renew',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewOtherStaffDCSchemas.getRenewOtherStaffsDCSchemas),
	renewOtherStaffCardController.getOtherStaffsDC,
);

otherStaffRouter.post(
	'/renew/create/:id',
	authorizerMiddlewares.requireUser,
	renewOtherStaffCardController.createRenewal,
);

otherStaffRouter.put(
	'/renew/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	renewOtherStaffCardController.pointFocalValidation,
);

otherStaffRouter.put(
	'/renew/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	renewOtherStaffCardController.adminValidation,
);

otherStaffRouter.put(
	'/renew/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	renewOtherStaffCardController.superAdminValidation,
);

otherStaffRouter.patch(
	'/renew/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewOtherStaffDCSchemas.setPrintedRenewOtherStaffDCSchema),
	renewOtherStaffCardController.setPrintedRenewOtherStaffDC,
);

otherStaffRouter.patch(
	'/renew/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	renewOtherStaffCardController.undoPrintRenewOtherStaffDC,
);

otherStaffRouter.patch(
	'/renew/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	renewOtherStaffCardController.setReturned,
);

// ============================================
// Routes Duplicata OtherStaffCard
// ============================================

otherStaffRouter.post(
	'/duplicata',
	authorizerMiddlewares.requireUser,
	validateInputResource(createDuplicaDCSchema),
	otherStaffDuplicataDCController.demandDuplicataCard,
);

otherStaffRouter.get(
	'/duplicata',
	authorizerMiddlewares.requireUser,
	validateInputResource(getsDuplicataDCsSchemas),
	otherStaffDuplicataDCController.getOtherStaffsDuplicataDC,
);

otherStaffRouter.get(
	'/duplicata/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	otherStaffDuplicataDCController.getOtherStaffDuplicataDC,
);

otherStaffRouter.put(
	'/duplicata/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	otherStaffDuplicataDCController.pointFocalValidation,
);

otherStaffRouter.put(
	'/duplicata/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	otherStaffDuplicataDCController.adminValidation,
);

otherStaffRouter.put(
	'/duplicata/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	otherStaffDuplicataDCController.superAdminValidation,
);

otherStaffRouter.patch(
	'/duplicata/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(printOtherStaffDuplicataDCSchema),
	otherStaffDuplicataDCController.setPrintedOtherStaffDuplicataDC,
);

otherStaffRouter.patch(
	'/duplicata/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	otherStaffDuplicataDCController.undoPrintOtherStaffDuplicataDC,
);

otherStaffRouter.patch(
	'/duplicata/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	otherStaffDuplicataDCController.setReturned,
);

otherStaffRouter.patch(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(OtherStaffDCSchemas.updateOtherStaffDCSchema),
	otherStaffDCController.update,
);
otherStaffRouter.delete(
	'/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	otherStaffDCController.deleteOtherStaffDC,
);
otherStaffRouter.get(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(OtherStaffDCSchemas.otherStaffDCByIdSchema),
	otherStaffDCController.getById,
);

export default otherStaffRouter;
