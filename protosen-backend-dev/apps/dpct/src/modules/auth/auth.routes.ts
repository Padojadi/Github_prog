import { Router } from 'express';
import AuthenticationController from './controllers/auth.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';
import { validateInputResource } from '@shared/middlewares/validateRessource.middlewares';
import {
	confirmAccountSchema,
	loginSchema,
	registerUserBySupAdminSchema,
	registerUserSchema,
} from './dtos/auth.dto';

const authRouter = Router();

// Login
authRouter.post('/login', validateInputResource(loginSchema), AuthenticationController.login);

// Register (requires admin authorization)
authRouter.post(
	'/register',
	authorizerMiddlewares.adminAuthorizer,
	validateInputResource(registerUserSchema),
	AuthenticationController.register,
);

// Refresh token
authRouter.post('/refresh', AuthenticationController.refreshToken);

// Super admin route to register user|admin
authRouter.post(
	'/super_admin/register',
	authorizerMiddlewares.superAdminAuthorizer,
	validateInputResource(registerUserBySupAdminSchema),
	AuthenticationController.supAdminRegisterUser,
);

// Confirm email
authRouter.post(
	'/confirmemail',
	validateInputResource(confirmAccountSchema),
	AuthenticationController.confirmUserAccount,
);

export default authRouter;
