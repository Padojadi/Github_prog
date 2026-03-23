import { faker } from '@faker-js/faker';

export interface InstitutionFactoryData {
  name?: string;
  code?: string;
  address?: string;
  type?: string;
  status?: 'active' | 'inactive';
}

export class InstitutionFactory {
  static build(overrides: InstitutionFactoryData = {}) {
    const name = overrides.name || `${faker.company.name()} Embassy`;
    const code = overrides.code || faker.string.alphanumeric(6).toUpperCase();

    return {
      name,
      code,
      address: overrides.address || faker.location.streetAddress(),
      type: overrides.type || 'Embassy',
      status: overrides.status || 'active',
    };
  }

  static buildMany(count: number, overrides: InstitutionFactoryData = {}) {
    return Array.from({ length: count }, () => this.build(overrides));
  }
}
