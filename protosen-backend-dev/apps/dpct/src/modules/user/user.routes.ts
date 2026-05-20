import { Router } from 'express';
import userControllers from './controllers/user.http.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '@shared/middlewares/validateRessource.middlewares';
import * as userSchemas from './dtos/user.dto';

const userRouter = Router();

// Get all users (super admin only)
userRouter.get('/all', authorizerMiddlewares.superAdminAuthorizer, userControllers.getUsers);

// Get current user
userRouter.get('/', authorizerMiddlewares.requireUser, userControllers.getUser);

// Get user by ID (admin only)
userRouter.get('/:id', authorizerMiddlewares.adminAuthorizer, userControllers.getUserById);

// Update current user
userRouter.patch(
	'/',
	authorizerMiddlewares.requireUser,
	validateInputResource(userSchemas.updateUserSchema),
	userControllers.updateUser,
);

// Update password
userRouter.put(
	'/update_password',
	authorizerMiddlewares.requireUser,
	validateInputResource(userSchemas.updatePasswordSchema),
	userControllers.UpdatePassword,
);

// Send verification code
userRouter.post(
	'/send_code',
	validateInputResource(userSchemas.sendCodeSchema),
	userControllers.sendCode,
);

// Reset password
userRouter.post(
	'/reset_password',
	validateInputResource(userSchemas.resetPasswordSchema),
	userControllers.resetPassword,
);

// Admin reset user password
userRouter.post(
	'/admin-reset_user_password',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(userSchemas.superAdminresetUserPasswordSchema),
	userControllers.superAdminResetPassword,
);

// Super admin update user
userRouter.put(
	'/super_admin/update/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(userSchemas.superAdminUpdateUserSchema),
	userControllers.superAdminUpdateUser,
);

// Super admin delete user
userRouter.delete(
	'/super_admin/delete/:id',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(userSchemas.userByIdSchema),
	userControllers.supAdminDeleteUser,
);

export default userRouter;
