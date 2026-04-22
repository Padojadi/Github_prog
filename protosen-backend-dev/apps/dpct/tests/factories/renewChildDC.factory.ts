import { faker } from '@faker-js/faker';
import { RenewChildDCCreationAttributes } from '../../database/models/card/child/renewchilddc';
import { EDocumentState } from '../../src/types/card.types';
import { StatusEnum } from '../../src/types';

export class RenewChildDCFactory {
  static buildMinimal(
    previousCardId: string,
    overrides: Partial<RenewChildDCCreationAttributes> = {}
  ): RenewChildDCCreationAttributes {
    return {
      previousCardId,
      cardNumber: `RCH-${faker.string.numeric(4)}-${faker.string.numeric(3)}-${new Date().getFullYear()}`,
      status: StatusEnum.ACTIVE,
      documentStage: EDocumentState.PENDING,
      expired: false,
      ...overrides,
    };
  }

  static buildPrinted(
    previousCardId: string,
    overrides: Partial<RenewChildDCCreationAttributes> = {}
  ): RenewChildDCCreationAttributes {
    return this.buildMinimal(previousCardId, {
      documentStage: EDocumentState.PRINTED,
      issueDate: faker.date.recent(),
      validUntil: faker.date.future({ years: 1 }),
      ...overrides,
    });
  }
}
