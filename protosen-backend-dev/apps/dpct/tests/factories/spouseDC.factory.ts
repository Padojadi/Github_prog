import { faker } from '@faker-js/faker';
import { SpouseDCCreationAttributes } from '../../database/models/card/spouse/spousedc';
import { EDocumentState, EDemandType } from '../../src/types/card.types';
import { StatusEnum } from '../../src/types';
import { EGenderEnum } from '../../src/types/user.types';

/**
 * Factory for creating SpouseDC test data
 */
export class SpouseDCFactory {
  /**
   * Build SpouseDC data (doesn't save to DB)
   */
  static build(overrides: Partial<SpouseDCCreationAttributes> = {}): SpouseDCCreationAttributes {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: `+221${faker.string.numeric(9)}`,
      gender: faker.helpers.arrayElement([EGenderEnum.MALE, EGenderEnum.FEMALE]),
      dateOfBirth: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }),
      placeOfBirth: faker.location.city(),
      citizenship: faker.location.country(),
      countryOfBirth: faker.location.country(),
      travellingNumber: faker.string.alphanumeric(10).toUpperCase(),
      deliverAt: faker.location.city(),
      deliverBy: faker.location.country(),
      deliverThe: faker.date.past(),
      travellingTitleType: faker.helpers.arrayElement(['PASSPORT', 'VISA', 'TRAVEL_DOCUMENT']),
      travellingTitleValidUntil: faker.date.future({ years: 2 }).toISOString(),
      status: StatusEnum.ACTIVE,
      documentStage: EDocumentState.PENDING,
      demandType: EDemandType.NEW,
      expired: false,
      ...overrides,
    };
  }

  /**
   * Build minimal SpouseDC data (only required fields)
   */
  static buildMinimal(
    creatorId: string,
    organismId: string,
    ownerDiplomaticCardId: string,
    overrides: Partial<SpouseDCCreationAttributes> = {}
  ): SpouseDCCreationAttributes {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: `+221${faker.string.numeric(9)}`,
      gender: EGenderEnum.FEMALE,
      dateOfBirth: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }),
      placeOfBirth: faker.location.city(),
      citizenship: faker.location.country(),
      countryOfBirth: faker.location.country(),
      travellingNumber: faker.string.alphanumeric(10).toUpperCase(),
      deliverAt: faker.location.city(),
      deliverBy: faker.location.country(),
      deliverThe: faker.date.past(),
      travellingTitleType: 'PASSPORT',
      travellingTitleValidUntil: faker.date.future({ years: 2 }).toISOString(),
      status: StatusEnum.ACTIVE,
      documentStage: EDocumentState.PENDING,
      demandType: EDemandType.NEW,
      expired: false,
      ownerDiplomaticCardId,
      creatorId,
      organismId,
      ...overrides,
    };
  }

  /**
   * Build with specific document stage
   */
  static buildWithStage(
    stage: EDocumentState,
    creatorId: string,
    organismId: string,
    ownerDiplomaticCardId: string,
    overrides: Partial<SpouseDCCreationAttributes> = {}
  ): SpouseDCCreationAttributes {
    return this.buildMinimal(creatorId, organismId, ownerDiplomaticCardId, {
      documentStage: stage,
      ...overrides,
    });
  }

  /**
   * Build printed SpouseDC
   */
  static buildPrinted(
    creatorId: string,
    organismId: string,
    ownerDiplomaticCardId: string,
    overrides: Partial<SpouseDCCreationAttributes> = {}
  ): SpouseDCCreationAttributes {
    return this.buildMinimal(creatorId, organismId, ownerDiplomaticCardId, {
      documentStage: EDocumentState.PRINTED,
      cardNumber: `SP-${faker.string.numeric(4)}-${faker.string.numeric(3)}-${new Date().getFullYear()}`,
      issueDate: faker.date.recent(),
      validUntil: faker.date.future({ years: 1 }),
      ...overrides,
    });
  }
}
