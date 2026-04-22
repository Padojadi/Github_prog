import { faker } from '@faker-js/faker';
import { CardTypeCreationAttributes } from '../../database/models/cardtype';

/**
 * Factory for creating CardType test data
 */
export class CardTypeFactory {
  /**
   * Build CardType data (doesn't save to DB)
   */
  static build(overrides: Partial<CardTypeCreationAttributes> = {}): CardTypeCreationAttributes {
    return {
      name: faker.helpers.arrayElement(['DC', 'CT', 'DI', 'SP']),
      description: faker.lorem.sentence(),
      observation: [faker.lorem.sentence(), faker.lorem.sentence()],
      ...overrides,
    };
  }

  /**
   * Build a specific CardType by name
   */
  static buildByName(name: string, overrides: Partial<CardTypeCreationAttributes> = {}): CardTypeCreationAttributes {
    return {
      name,
      description: `${name} Card Type`,
      observation: [`Observation 1 for ${name}`, `Observation 2 for ${name}`],
      ...overrides,
    };
  }

  /**
   * Build minimal CardType data (only required fields)
   */
  static buildMinimal(overrides: Partial<CardTypeCreationAttributes> = {}): CardTypeCreationAttributes {
    return {
      name: faker.helpers.arrayElement(['DC', 'CT', 'DI', 'SP']),
      observation: [faker.lorem.sentence()],
      ...overrides,
    };
  }
}
