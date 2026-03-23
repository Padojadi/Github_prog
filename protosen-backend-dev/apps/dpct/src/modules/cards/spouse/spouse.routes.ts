import { Router } from 'express';
import spouseDCController from './controllers/spouse-card.controller';
import renewSpouseCardController from './controllers/spouse-renew-card.controller';
import spouseDuplicataDCController from './controllers/spouse-duplicata-card.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '@shared/middlewares/validateRessource.middlewares';
import * as SpouseDCSchemas from './dtos/spouse-card.dto';
import * as RenewSpouseDCSchemas from './dtos/spouse-renew.dto';
import {
	createDuplicaDCSchema,
	getsDuplicataDCsSchemas,
	printSpouseDuplicataDCSchema,
} from './dtos/spouse-duplicata.dto';
import { deleteFileByIdSchema, attachFileSpouseDCByIdSchema } from '@shared/schemas/file.schema';
import {
	adminValidateDocSchema,
	getByIdSchema,
	superAdminValidateDocSchema,
} from '@shared/schemas/public.schemas';
import { multerConfig } from '@appconfig/multer';

const spouseRouter = Router();

// Configuration multer pour les fichiers
const upload = multerConfig.fields([
	{
		name: 'passport',
	},
	{
		name: 'am',
	},
	{
		name: 'photo',
	},
	{
		name: 'others',
	},
]);

// ============================================
// Routes principales SpouseCard
// ============================================

spouseRouter.post(
	'/',
	authorizerMiddlewares.requireUser,
	validateInputResource(SpouseDCSchemas.createSpouseDCSchema),
	spouseDCController.create,
);

spouseRouter.get(
	'/',
	authorizerMiddlewares.requireUser,
	validateInputResource(SpouseDCSchemas.getSpousesDCSchemas),
	spouseDCController.getSpousesDC,
);

spouseRouter.post(
	'/files',
	authorizerMiddlewares.requireUser,
	upload,
	validateInputResource(attachFileSpouseDCByIdSchema),
	spouseDCController.attachFiles,
);

spouseRouter.put(
	'/files',
	authorizerMiddlewares.requireUser,
	upload,
	validateInputResource(attachFileSpouseDCByIdSchema),
	spouseDCController.attachOtherFiles,
);

spouseRouter.patch(
	'/files/other/delete/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(deleteFileByIdSchema),
	spouseDCController.deleteOtherFiles,
);

spouseRouter.put(
	'/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	spouseDCController.pointFocalValidation,
);

spouseRouter.put(
	'/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	spouseDCController.adminValidation,
);

spouseRouter.put(
	'/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	spouseDCController.superAdminValidation,
);

spouseRouter.patch(
	'/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(SpouseDCSchemas.printSpouseDCSchema),
	spouseDCController.setPrintSpouseDC,
);

spouseRouter.patch(
	'/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	spouseDCController.undoPrintOwnerDC,
);

spouseRouter.patch(
	'/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	spouseDCController.setReturned,
);

// ============================================
// Routes Renew SpouseCard
// ============================================

spouseRouter.get(
	'/renew/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewSpouseDCSchemas.renewSpouseDCByIdSchema),
	renewSpouseCardController.getSpouseCard,
);

spouseRouter.get(
	'/renew',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewSpouseDCSchemas.getRenewSpousesDCSchemas),
	renewSpouseCardController.getSpousesDC,
);

spouseRouter.post(
	'/renew/create/:id',
	authorizerMiddlewares.requireUser,
	renewSpouseCardController.createRenewal,
);

spouseRouter.put(
	'/renew/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	renewSpouseCardController.pointFocalValidation,
);

spouseRouter.put(
	'/renew/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	renewSpouseCardController.adminValidation,
);

spouseRouter.put(
	'/renew/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	renewSpouseCardController.superAdminValidation,
);

spouseRouter.patch(
	'/renew/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(RenewSpouseDCSchemas.setPrintedRenewSpouseDCSchema),
	renewSpouseCardController.setPrintedRenewSpouseDC,
);

spouseRouter.patch(
	'/renew/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	renewSpouseCardController.undoPrintRenewSpouseDC,
);

spouseRouter.patch(
	'/renew/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	renewSpouseCardController.setReturned,
);

// ============================================
// Routes Duplicata SpouseCard
// ============================================

spouseRouter.post(
	'/duplicata',
	authorizerMiddlewares.requireUser,
	validateInputResource(createDuplicaDCSchema),
	spouseDuplicataDCController.demandDuplicataCard,
);

spouseRouter.get(
	'/duplicata',
	authorizerMiddlewares.requireUser,
	validateInputResource(getsDuplicataDCsSchemas),
	spouseDuplicataDCController.getSpousesDuplicataDC,
);

spouseRouter.get(
	'/duplicata/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	spouseDuplicataDCController.getSpouseDuplicataDC,
);

spouseRouter.put(
	'/duplicata/pointfocal/validate/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(getByIdSchema),
	spouseDuplicataDCController.pointFocalValidation,
);

spouseRouter.put(
	'/duplicata/admin/validate/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(adminValidateDocSchema),
	spouseDuplicataDCController.adminValidation,
);

spouseRouter.put(
	'/duplicata/superadmin/validate/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(superAdminValidateDocSchema),
	spouseDuplicataDCController.superAdminValidation,
);

spouseRouter.patch(
	'/duplicata/set-printed/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(printSpouseDuplicataDCSchema),
	spouseDuplicataDCController.setPrintedSpouseDuplicataDC,
);

spouseRouter.patch(
	'/duplicata/undo-print/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	spouseDuplicataDCController.undoPrintSpouseDuplicataDC,
);

spouseRouter.patch(
	'/duplicata/set-returned/:id',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(getByIdSchema),
	spouseDuplicataDCController.setReturned,
);

spouseRouter.patch(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(SpouseDCSchemas.updateSpouseDCSchema),
	spouseDCController.updateSpouseDC,
);
spouseRouter.delete(
	'/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	spouseDCController.deleteSpouseDC,
);
spouseRouter.get(
	'/:id',
	authorizerMiddlewares.requireUser,
	validateInputResource(SpouseDCSchemas.spouseDCByIdSchema),
	spouseDCController.getSpouseDC,
);

export default spouseRouter;
