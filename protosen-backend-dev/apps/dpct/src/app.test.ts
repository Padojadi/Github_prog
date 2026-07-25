/**
 * Test version of app.ts
 * Exports the Express app without starting the server
 * Used by integration tests with supertest
 */

import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import deserializeUser from './shared/middlewares/deserialize.middelwares';
import router from './routes';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(deserializeUser);

const allowedOrigins = [
	'https://protosen.gouv.sn',
	'https://protosendev.gouv.sn',
	'http://localhost:3000',
];

const corsOptions: cors.CorsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(null, true); // For tests, allow all origins
		}
	},
	credentials: true,
};

app.use(cors(corsOptions));

app.use('/uploads', express.static('uploads'));

app.get('/healthcheck', (_, res) => {
	res.status(200).send({ msg: 'All is ok' });
});

app.use('/api', router);

// Export app without starting the server
export default app;
