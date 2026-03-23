import { config as dotenvConfig } from 'dotenv';
import db from '../database/models';

// Load test environment variables
dotenvConfig();

const sequelize = db.sequelize;

// Ensure we're in test environment
if (process.env.NODE_ENV !== 'test') {
  throw new Error('Tests must be run with NODE_ENV=test');
}

// Setup hooks
beforeAll(async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('✓ Test database connected');

    // Sync database (will create tables if they don't exist)
    // Use force: true only for test database
    await sequelize.sync({ force: false });
    console.log('✓ Test database synced');
  } catch (error) {
    console.error('✗ Unable to connect to test database:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await sequelize.close();
    console.log('✓ Test database connection closed');
  } catch (error) {
    console.error('✗ Error closing test database:', error);
  }
});

// Clear database between test suites (optional, can be configured per test)
afterEach(async () => {
  // Uncomment if you want to clear DB after each test
  // await clearDatabase();
});

/**
 * Clear all data from database tables
 */
export async function clearDatabase() {
  const models = Object.values(db).filter(
    (value) => typeof value === 'object' && value.tableName
  );

  for (const model of models) {
    if (typeof model.destroy === 'function') {
      await model.destroy({
        where: {},
        truncate: true,
        cascade: true,
        restartIdentity: true,
      });
    }
  }
}

/**
 * Reset database to clean state
 */
export async function resetDatabase() {
  await sequelize.sync({ force: true });
}
