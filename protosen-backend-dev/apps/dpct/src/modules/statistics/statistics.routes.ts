import { Router } from 'express';
import statisticsController from './controllers/statistics.controller';
import authorizerMiddlewares from '@shared/middlewares/authorizer.middlewares';

const statisticsRouter = Router();

// Get card statistics (admin only)
statisticsRouter.get(
	'/card',
	authorizerMiddlewares.adminAuthorizer,
	statisticsController.cardStats,
);

// Get renewed card statistics (admin only)
statisticsRouter.get(
	'/card/renew',
	authorizerMiddlewares.adminAuthorizer,
	statisticsController.renewedCardStats,
);

// Get duplicata card statistics (admin only)
statisticsRouter.get(
	'/card/duplicata',
	authorizerMiddlewares.adminAuthorizer,
	statisticsController.duplicataCardStats,
);

export default statisticsRouter;
