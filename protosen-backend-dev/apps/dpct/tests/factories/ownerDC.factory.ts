import { faker } from '@faker-js/faker';
import { OwnerDiplomaticCardCreationAttributes } from '../../database/models/card/owner/ownerdiplomaticcard';
import { EDocumentState } from '../../src/types/card.types';
import { StatusEnum } from '../../src/types';
import { EGenderEnum } from '../../src/types/user.types';

/**
 * Factory for creating OwnerDiplomaticCard test data
 */
export class OwnerDCFactory {
  /**
   * Build OwnerDiplomaticCard data (doesn't save to DB)
   */
  static build(overrides: Partial<OwnerDiplomaticCardCreationAttributes> = {}): OwnerDiplomaticCardCreationAttributes {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      title: faker.helpers.arrayElement(['Mr', 'Mrs', 'Ms', 'Dr', 'Prof']),
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: `+221${faker.string.numeric(9)}`,
      matrimonialStatus: faker.helpers.arrayElement(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']),
      gender: faker.helpers.arrayElement([EGenderEnum.MALE, EGenderEnum.FEMALE]),
      plaque: null,
      dateOfBirth: faker.date.birthdate({ min: 30, max: 70, mode: 'age' }),
      placeOfBirth: faker.location.city(),
      citizenship: faker.location.country(),
      countryOfBirth: faker.location.country(),
      grade: faker.helpers.arrayElement(['Ambassador', 'Consul', 'Attaché', 'Secretary']),
      personReplaced: null,
      cardNumber: null,
      jobFunction: faker.person.jobTitle(),
      travellingNumber: faker.string.alphanumeric(10).toUpperCase(),
      deliverAt: faker.location.city(),
      deliverBy: faker.location.country(),
      deliverThe: faker.date.past(),
      issueDate: null,
      travellingTitleType: faker.helpers.arrayElement(['PASSPORT', 'VISA', 'TRAVEL_DOCUMENT']),
      dateTakingOffice: faker.date.recent({ days: 30 }),
      dateArrivalSenegal: faker.date.recent({ days: 60 }),
      travellingTitleValidUntil: faker.date.future({ years: 2 }),
      dateEndOfMission: faker.date.future({ years: 3 }),
      lastCityAbroad: faker.location.city(),
      adressSenegal: faker.location.streetAddress(),
      lastCountryAbroad: faker.location.country(),
      latestOfWorkCountry: faker.location.country(),
      latestWorkStructure: faker.company.name(),
      lastestWorkDate: faker.date.past(),
      lastStreetAbroad: faker.location.streetAddress(),
      rejectReason: null,
      status: StatusEnum.ACTIVE,
      documentStage: EDocumentState.PENDING,
      validUntil: null,
      expired: false,
      type_card: null,
      color: null,
      description: null,
      observation: null,
      ...overrides,
    };
  }

  /**
   * Build with specific document stage
   */
  static buildWithStage(
    stage: EDocumentState,
    overrides: Partial<OwnerDiplomaticCardCreationAttributes> = {}
  ): OwnerDiplomaticCardCreationAttributes {
    return this.build({
      documentStage: stage,
      ...overrides,
    });
  }

  /**
   * Build approved card
   */
  static buildApproved(overrides: Partial<OwnerDiplomaticCardCreationAttributes> = {}): OwnerDiplomaticCardCreationAttributes {
    return this.build({
      documentStage: EDocumentState.APPROVED,
      validUntil: faker.date.future({ years: 1 }),
      ...overrides,
    });
  }

  /**
   * Build printed card
   */
  static buildPrinted(overrides: Partial<OwnerDiplomaticCardCreationAttributes> = {}): OwnerDiplomaticCardCreationAttributes {
    return this.build({
      documentStage: EDocumentState.PRINTED,
      cardNumber: `DC-${faker.string.numeric(4)}-${faker.string.numeric(3)}-${new Date().getFullYear()}`,
      issueDate: faker.date.recent(),
      validUntil: faker.date.future({ years: 1 }),
      ...overrides,
    });
  }

  /**
   * Build rejected card
   */
  static buildRejected(overrides: Partial<OwnerDiplomaticCardCreationAttributes> = {}): OwnerDiplomaticCardCreationAttributes {
    return this.build({
      documentStage: EDocumentState.REJECTED,
      rejectReason: faker.lorem.sentence(),
      ...overrides,
    });
  }

  /**
   * Build minimal OwnerDiplomaticCard data (only required fields)
   */
  static buildMinimal(
    creatorId: string,
    organismId: string,
    overrides: Partial<OwnerDiplomaticCardCreationAttributes> = {}
  ): OwnerDiplomaticCardCreationAttributes {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      title: 'Mr',
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: `+221${faker.string.numeric(9)}`,
      matrimonialStatus: 'SINGLE',
      gender: EGenderEnum.MALE,
      dateOfBirth: faker.date.birthdate({ min: 30, max: 70, mode: 'age' }),
      placeOfBirth: faker.location.city(),
      citizenship: faker.location.country(),
      countryOfBirth: faker.location.country(),
      grade: 'Ambassador',
      jobFunction: faker.person.jobTitle(),
      travellingNumber: faker.string.alphanumeric(10).toUpperCase(),
      deliverAt: faker.location.city(),
      deliverBy: faker.location.country(),
      deliverThe: faker.date.past(),
      travellingTitleType: 'PASSPORT',
      dateTakingOffice: faker.date.recent({ days: 30 }),
      dateArrivalSenegal: faker.date.recent({ days: 60 }),
      travellingTitleValidUntil: faker.date.future({ years: 2 }),
      dateEndOfMission: faker.date.future({ years: 3 }),
      lastCityAbroad: faker.location.city(),
      lastCountryAbroad: faker.location.country(),
      latestOfWorkCountry: faker.location.country(),
      latestWorkStructure: faker.company.name(),
      lastestWorkDate: faker.date.past(),
      lastStreetAbroad: faker.location.streetAddress(),
      status: StatusEnum.ACTIVE,
      documentStage: EDocumentState.PENDING,
      expired: false,
      creatorId,
      organismId,
      ...overrides,
    };
  }
}
