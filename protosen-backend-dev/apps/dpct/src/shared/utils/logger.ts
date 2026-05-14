import logger from 'pino';
import dayjs from 'dayjs';
import env from '@appconfig/env.config';

const level = env.LOG_LEVEL;
// Use process.env directly to avoid dotenv overriding NODE_ENV from Docker
const isProduction = process.env.NODE_ENV === 'production';

const log = logger({
	...(!isProduction
		? {
				transport: {
					target: 'pino-pretty',
				},
			}
		: {}),
	level,
	base: {
		pid: false,
	},
	timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
