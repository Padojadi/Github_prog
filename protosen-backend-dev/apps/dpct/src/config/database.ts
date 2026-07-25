import db from '../database/models';
import log from '../shared/utils/logger';

/**
 * Connects to PostgreSQL database via Sequelize
 * Used by both Express app and gRPC server
 */
const connectToPostgresSQL = async () => {
	log.info('Connecting to PostgreSQL via Sequelize CLI models...');

	// Just authenticate to verify connection
	await db.sequelize
		.authenticate()
		.then(() => {
			log.info('PostgreSQL Connection has been established successfully.');
			log.info('✓ Using Sequelize CLI models from database/models');
		})
		.catch((err) => {
			log.error('Unable to connect to the PostgreSQL database:', err);
			throw err;
		});
};

export default connectToPostgresSQL;
