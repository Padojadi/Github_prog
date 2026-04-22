import { faker } from '@faker-js/faker';
import { AccessGroupCreationAttributes } from '../../database/models/accessgroup';

/**
 * Factory for creating AccessGroup test data
 */
export class AccessGroupFactory {
  /**
   * Build AccessGroup data (doesn't save to DB)
   */
  static build(overrides: Partial<AccessGroupCreationAttributes> = {}): AccessGroupCreationAttributes {
    return {
      name: faker.company.name(),
      permissions: [
        'read:cards',
        'write:cards',
        'read:users',
      ],
      editable: true,
      ...overrides,
    };
  }

  /**
   * Build a specific AccessGroup by name
   */
  static buildByName(name: string, overrides: Partial<AccessGroupCreationAttributes> = {}): AccessGroupCreationAttributes {
    return {
      name,
      permissions: [`read:${name.toLowerCase()}`, `write:${name.toLowerCase()}`],
      editable: true,
      ...overrides,
    };
  }

  /**
   * Build a non-editable AccessGroup (system default)
   */
  static buildNonEditable(overrides: Partial<AccessGroupCreationAttributes> = {}): AccessGroupCreationAttributes {
    return {
      name: 'System Admin',
      permissions: ['*'],
      editable: false,
      ...overrides,
    };
  }

  /**
   * Build minimal AccessGroup data (only required fields)
   */
  static buildMinimal(overrides: Partial<AccessGroupCreationAttributes> = {}): AccessGroupCreationAttributes {
    return {
      name: faker.company.name(),
      permissions: ['read:basic'],
      editable: true,
      ...overrides,
    };
  }
}
