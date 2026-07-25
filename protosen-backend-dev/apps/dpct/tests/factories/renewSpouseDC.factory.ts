import { faker } from '@faker-js/faker';
import { RenewSpouseDCCreationAttributes } from '../../database/models/card/spouse/renewspousedc';
import { EDocumentState } from '../../src/types/card.types';
import { StatusEnum } from '../../src/types';

export class RenewSpouseDCFactory {
  static buildMinimal(
    previousCardId: string,
    overrides: Partial<RenewSpouseDCCreationAttributes> = {}
  ): RenewSpouseDCCreationAttributes {
    return {
      previousCardId,
      cardNumber: `RSP-${faker.string.numeric(4)}-${faker.string.numeric(3)}-${new Date().getFullYear()}`,
      status: StatusEnum.ACTIVE,
      documentStage: EDocumentState.PENDING,
      expired: false,
      ...overrides,
    };
  }

  static buildPrinted(
    previousCardId: string,
    overrides: Partial<RenewSpouseDCCreationAttributes> = {}
  ): RenewSpouseDCCreationAttributes {
    return this.buildMinimal(previousCardId, {
      documentStage: EDocumentState.PRINTED,
      issueDate: faker.date.recent(),
      validUntil: faker.date.future({ years: 1 }),
      ...overrides,
    });
  }
}
