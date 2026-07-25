import { faker } from '@faker-js/faker';
import { OtherDependantDCCreationAttributes } from '../../database/models/card/otherDependant/otherdependantdc';
import { EDocumentState, EDemandType } from '../../src/types/card.types';
import { StatusEnum } from '../../src/types';
import { EGenderEnum } from '../../src/types/user.types';

/**
 * Factory for creating OtherDependantDC test data
 */
export class OtherDependantDCFactory {
  /**
   * Build minimal OtherDependantDC data (only required fields)
   */
  static buildMinimal(
    creatorId: string,
    organismId: string,
    ownerDiplomaticCardId: string,
    overrides: Partial<OtherDependantDCCreationAttributes> = {}
  ): OtherDependantDCCreationAttributes {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: `+221${faker.string.numeric(9)}`,
      gender: faker.helpers.arrayElement([EGenderEnum.MALE, EGenderEnum.FEMALE]),
      dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
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
   * Build printed OtherDependantDC
   */
  static buildPrinted(
    creatorId: string,
    organismId: string,
    ownerDiplomaticCardId: string,
    overrides: Partial<OtherDependantDCCreationAttributes> = {}
  ): OtherDependantDCCreationAttributes {
    return this.buildMinimal(creatorId, organismId, ownerDiplomaticCardId, {
      documentStage: EDocumentState.PRINTED,
      cardNumber: `OD-${faker.string.numeric(4)}-${faker.string.numeric(3)}-${new Date().getFullYear()}`,
      issueDate: faker.date.recent(),
      validUntil: faker.date.future({ years: 1 }),
      ...overrides,
    });
  }
}
