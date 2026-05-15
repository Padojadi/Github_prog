import * as dotenv from 'dotenv';
dotenv.config();

// Validate environment variables before anything else
import './config/env.config';

import express from 'express';
import cors from 'cors';
import log from './shared/utils/logger';
import deserializeUser from './shared/middlewares/deserialize.middelwares';
import router from './routes';
import swaggerRouter from './routes/swagger.routes';
import { scheduleVerificationCodeCleanup } from './jobs/cleanup-verification-code.job';
import cron from 'node-cron';
import {
	updateExpiredStatusOwner,
	updateExpiredStatusChild,
	updateExpiredStatusDomesticeAndRelative,
	updateExpiredStatusOwnerRenewed,
	updateExpiredStatusOtherDependant,
	updateExpiredStatusOtherStaff,
	updateExpiredStatusSpouse,
	updateExpiredStatusSpouseRenewed,
	updateExpiredStatusChildRenewed,
	updateExpiredStatusOtherStaffRenewed,
	updateExpiredStatusOtherDependantRenewed,
	updateExpiredStatusDomesticAndRelativeRenewed,
} from './jobs/update-expired-status.job';
import connectToPostgresSQL from './config/database';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.disable('x-powered-by');

app.use(deserializeUser);
const parseAllowedOrigins = (raw: string | undefined) =>
	(raw || '')
		.split(',')
		.map((value) => value.trim())
		.filter(Boolean);
const configuredOrigins = parseAllowedOrigins(process.env.CORS_ALLOWED_ORIGINS);
const allowedOrigins =
	configuredOrigins.length > 0
		? configuredOrigins
		: [
				'https://protosen.gouv.sn',
				'https://protosendev.gouv.sn',
				'https://protosen.2ticglobal.com',
				'http://localhost:3000',
				'http://127.0.0.1:3000',
			];

const corsOptions: cors.CorsOptions = {
	origin: function (origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true, // si tu utilises des cookies ou des headers d'authentification
};

app.use(cors(corsOptions));

app.use('/uploads', express.static('uploads'));

// Health check endpoints (no auth required)
app.get('/health', (_, res) => {
	res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/healthcheck', (_, res) => {
	res.status(200).send({ msg: 'All is ok' });
});

// API Documentation (désactivé en production)
if (process.env.NODE_ENV !== 'production') {
	app.use('/api-docs', swaggerRouter);
	log.info('Swagger documentation enabled at /api-docs');
} else {
	log.info('Swagger documentation disabled in production');
}

// API Routes
app.use('/api', router);

const PORT = process.env.PORT;

// Clean up expired verification codes.
scheduleVerificationCodeCleanup();

// Run the cron job every day at 23:00
cron.schedule('0 23 * * *', () => {
	log.info('Running cron job to update expired status...');
	updateExpiredStatusOwner();
	updateExpiredStatusSpouse();
	updateExpiredStatusOtherStaff();
	updateExpiredStatusOtherDependant();
	updateExpiredStatusChild();
	updateExpiredStatusDomesticeAndRelative();

	// renew renewed cards
	updateExpiredStatusOwnerRenewed();
	updateExpiredStatusSpouseRenewed();
	updateExpiredStatusChildRenewed();
	updateExpiredStatusOtherStaffRenewed();
	updateExpiredStatusOtherDependantRenewed();
	updateExpiredStatusDomesticAndRelativeRenewed();
});

// Connect to database and start server
connectToPostgresSQL()
	.then(() => {
		app.listen(PORT, () => {
			log.info(`Server is running on port ${PORT}`);
		});
	})
	.catch((err) => {
		log.error('Failed to start server:', err);
		process.exit(1);
	});

export default app;
