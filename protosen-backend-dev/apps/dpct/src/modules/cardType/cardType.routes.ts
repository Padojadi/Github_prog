import { Router } from 'express';
import { CardTypeController } from './controllers/cardType.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '@shared/middlewares/validateRessource.middlewares';
import { createCardTypeSchema, updateCardTypeSchema } from './dtos/cardType.dto';

const cardTypeRouter = Router();

// Create card type (super admin only)
cardTypeRouter.post(
	'/',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(createCardTypeSchema),
	CardTypeController.create,
);

// Get all card types (authenticated users)
cardTypeRouter.get('/', authorizerMiddlewares.requireUser, CardTypeController.getAll);

// Get card type by ID (authenticated users)
cardTypeRouter.get('/:id', authorizerMiddlewares.requireUser, CardTypeController.getById);

// Update card type (super admin only)
cardTypeRouter.put(
	'/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(updateCardTypeSchema),
	CardTypeController.update,
);

// Delete card type (super admin only)
cardTypeRouter.delete(
	'/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	CardTypeController.delete,
);

export default cardTypeRouter;
