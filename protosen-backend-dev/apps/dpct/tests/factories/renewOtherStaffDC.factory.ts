import { faker } from '@faker-js/faker';
import { RenewOtherStaffDCCreationAttributes } from '../../database/models/card/otherStaff/renewotherstaffdc';
import { EDocumentState } from '../../src/types/card.types';
import { StatusEnum } from '../../src/types';

export class RenewOtherStaffDCFactory {
  static buildMinimal(
    previousCardId: string,
    overrides: Partial<RenewOtherStaffDCCreationAttributes> = {}
  ): RenewOtherStaffDCCreationAttributes {
    return {
      previousCardId,
      cardNumber: `ROS-${faker.string.numeric(4)}-${faker.string.numeric(3)}-${new Date().getFullYear()}`,
      status: StatusEnum.ACTIVE,
      documentStage: EDocumentState.PENDING,
      expired: false,
      ...overrides,
    };
  }

  static buildPrinted(
    previousCardId: string,
    overrides: Partial<RenewOtherStaffDCCreationAttributes> = {}
  ): RenewOtherStaffDCCreationAttributes {
    return this.buildMinimal(previousCardId, {
      documentStage: EDocumentState.PRINTED,
      issueDate: faker.date.recent(),
      validUntil: faker.date.future({ years: 1 }),
      ...overrides,
    });
  }
}
