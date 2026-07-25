import { Router } from 'express';
import institutionController from './controllers/institution.http.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '@shared/middlewares/validateRessource.middlewares';
import * as institutionSchema from './dtos/institution.dto';

const institutionRouter = Router();

// Get institutions (super admin only)
institutionRouter.get(
	'/',
	authorizerMiddlewares.superAdminAuthorizer,
	institutionController.getInstitutions,
);

// Create institutions from seeds (super admin only)
institutionRouter.post(
	'/seeds',
	authorizerMiddlewares.superAdminAuthorizer,
	institutionController.create,
);

// Create institution (super admin only)
institutionRouter.post(
	'/',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(institutionSchema.createInstitutionSchema),
	institutionController.createInstitution,
);

// Update institution (super admin only)
institutionRouter.put(
	'/update/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(institutionSchema.updateInstitutionSchema),
	institutionController.updateInstitution,
);

// Delete institution (super admin only)
institutionRouter.delete(
	'/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	institutionController.deleteInstitution,
);

export default institutionRouter;
