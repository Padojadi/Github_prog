import { Router } from 'express';
import { AccessGroupController } from './controllers/accessgroup.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '@shared/middlewares/validateRessource.middlewares';
import { createAccessgroupTypeSchema, updateAccessgroupTypeSchema } from './dtos/accessgroup.dto';

const accessgroupRouter = Router();

// Create access group (super admin only)
accessgroupRouter.post(
	'/',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(createAccessgroupTypeSchema),
	AccessGroupController.create,
);

// Get all access groups (authenticated users)
accessgroupRouter.get('/', authorizerMiddlewares.requireUser, AccessGroupController.getAll);

// Get access group by ID (authenticated users)
accessgroupRouter.get('/:id', authorizerMiddlewares.requireUser, AccessGroupController.getById);

// Update access group (super admin only)
accessgroupRouter.put(
	'/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(updateAccessgroupTypeSchema),
	AccessGroupController.update,
);

// Delete access group (super admin only)
accessgroupRouter.delete(
	'/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	AccessGroupController.delete,
);

export default accessgroupRouter;
