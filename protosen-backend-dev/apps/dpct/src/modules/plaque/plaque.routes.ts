import { Router } from 'express';
import { PlaqueController } from './controllers/plaque.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '@shared/middlewares/validateRessource.middlewares';
import { createPlaqueSchema } from './dtos/plaque.dto';

const plaqueRouter = Router();

// Create plaque (super admin only)
plaqueRouter.post(
	'/',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(createPlaqueSchema),
	PlaqueController.create,
);

// Get all plaques (authenticated users)
plaqueRouter.get('/', authorizerMiddlewares.requireUser, PlaqueController.getAll);

// Get plaque by ID (authenticated users)
plaqueRouter.get('/:id', authorizerMiddlewares.requireUser, PlaqueController.getById);

// Update plaque (super admin only)
plaqueRouter.put(
	'/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(createPlaqueSchema),
	PlaqueController.update,
);

// Delete plaque (super admin only)
plaqueRouter.delete('/:id', authorizerMiddlewares.superAdminAuthorizer, PlaqueController.delete);

export default plaqueRouter;
