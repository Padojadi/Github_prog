import { faker } from '@faker-js/faker';

export interface ChildDCFactoryData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  nationality?: string;
  gender?: 'M' | 'F';
  email?: string;
  travellingNumber?: string;
  ownerDiplomaticCardId?: string;
  organismId?: string;
  creatorId?: string;
  demandType?: 'New' | 'Renewal' | 'Duplicata';
}

export class ChildDCFactory {
  static build(overrides: ChildDCFactoryData = {}) {
    const gender = overrides.gender || (faker.datatype.boolean() ? 'M' : 'F');

    return {
      firstName: overrides.firstName || faker.person.firstName(gender === 'M' ? 'male' : 'female'),
      lastName: overrides.lastName || faker.person.lastName(),
      dateOfBirth: overrides.dateOfBirth || faker.date.birthdate({ min: 0, max: 18, mode: 'age' }).toISOString().split('T')[0],
      placeOfBirth: overrides.placeOfBirth || faker.location.city(),
      nationality: overrides.nationality || faker.location.country(),
      gender,
      email: overrides.email || faker.internet.email(),
      travellingNumber: overrides.travellingNumber || faker.string.alphanumeric(10).toUpperCase(),
      ownerDiplomaticCardId: overrides.ownerDiplomaticCardId,
      organismId: overrides.organismId,
      creatorId: overrides.creatorId,
      demandType: overrides.demandType || 'New',
      expired: false,
      status: 'active',
      documentStage: 'ONHOLD',
    };
  }

  static buildMany(count: number, overrides: ChildDCFactoryData = {}) {
    return Array.from({ length: count }, () => this.build(overrides));
  }
}
