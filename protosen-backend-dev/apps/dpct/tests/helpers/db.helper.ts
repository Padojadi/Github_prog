import db from '../../database/models';

const sequelize = db.sequelize;

/**
 * Clear all tables in the database
 */
export async function clearAllTables(): Promise<void> {
  const models = [
    // Order matters due to foreign key constraints
    // Delete child tables first
    'ChildDuplicataDC',
    'RenewChildDC',
    'ChildDCFile',
    'ChildDC',

    'SpouseDuplicataDC',
    'RenewSpouseDC',
    'SpouseDCFile',
    'SpouseDC',

    'OwnerDuplicataDC',
    'RenewOwnerDC',
    'OwnerDiplomaticCardFile',
    'OwnerDiplomaticCard',

    'OtherDependantDuplicataDC',
    'RenewOtherDependantDC',
    'OtherDependantDCFile',
    'OtherDependantDC',

    'DomesticAndRelativeDuplicataDC',
    'RenewDomesticAndRelativeDC',
    'DomesticAndRelativeDCFile',
    'DomesticAndRelativeDC',

    'OtherStaffDuplicataDC',
    'RenewOtherStaffDC',
    'OtherStaffDCFile',
    'OtherStaffDC',

    'RefreshToken',
    'User',
    'Institution',
    'CardType',
    'Plaque',
    'AccessGroup',
  ];

  for (const modelName of models) {
    const model = db[modelName];
    if (model && typeof model.destroy === 'function') {
      try {
        await model.destroy({
          where: {},
          truncate: true,
          cascade: true,
          force: true,
        });
      } catch (error) {
        // Ignore errors for models that don't exist
        console.warn(`Could not clear ${modelName}:`, error.message);
      }
    }
  }
}

/**
 * Seed basic data needed for most tests
 */
export async function seedBasicData(): Promise<{
  institution: any;
  cardType: any;
  plaque: any;
  accessGroup: any;
}> {
  const institution = await db.Institution.create({
    name: 'Test Embassy',
    code: 'TEST001',
    address: '123 Test Street',
    type: 'Embassy',
    status: 'active',
  });

  const cardType = await db.CardType.create({
    name: 'Diplomatic Card',
    code: 'DC',
    description: 'Standard diplomatic card',
  });

  const plaque = await db.Plaque.create({
    number: 'TEST-001',
    isAvailable: true,
  });

  const accessGroup = await db.AccessGroup.create({
    name: 'Full Access',
    code: 'FULL',
    description: 'Full access to all areas',
  });

  return {
    institution,
    cardType,
    plaque,
    accessGroup,
  };
}

/**
 * Reset database to clean state and sync schema
 */
export async function resetDatabase(): Promise<void> {
  await sequelize.sync({ force: true });
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  await sequelize.close();
}
