import { Router } from 'express';
import systemSettingsController from './controllers/systemSettings.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '@shared/middlewares/validateRessource.middlewares';
import { updateSystemSettingsSchema } from './dtos/systemSettings.dto';

const systemSettingsRouter = Router();

// Get system settings (authenticated users)
systemSettingsRouter.get('/', authorizerMiddlewares.requireUser, systemSettingsController.get);

// Update system settings (super admin only)
systemSettingsRouter.put(
	'/',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(updateSystemSettingsSchema),
	systemSettingsController.update,
);

export default systemSettingsRouter;
