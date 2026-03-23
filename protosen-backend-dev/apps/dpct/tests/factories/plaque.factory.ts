import { faker } from '@faker-js/faker';
import { PlaqueCreationAttributes } from '../../database/models/plaque';

/**
 * Factory for creating Plaque test data
 */
export class PlaqueFactory {
  /**
   * Build Plaque data (doesn't save to DB)
   */
  static build(overrides: Partial<PlaqueCreationAttributes> = {}): PlaqueCreationAttributes {
    return {
      code: faker.string.alpha({ length: 4, casing: 'upper' }),
      title: faker.company.name(),
      ...overrides,
    };
  }

  /**
   * Build a specific Plaque by code
   */
  static buildByCode(code: string, overrides: Partial<PlaqueCreationAttributes> = {}): PlaqueCreationAttributes {
    return {
      code,
      title: `Plaque ${code}`,
      ...overrides,
    };
  }

  /**
   * Build multiple plaques with different codes
   */
  static buildMultiple(count: number): PlaqueCreationAttributes[] {
    const plaques: PlaqueCreationAttributes[] = [];
    const codes = new Set<string>();

    while (codes.size < count) {
      codes.add(faker.string.alpha({ length: 4, casing: 'upper' }));
    }

    codes.forEach((code) => {
      plaques.push({
        code,
        title: `Plaque ${code}`,
      });
    });

    return plaques;
  }
}
