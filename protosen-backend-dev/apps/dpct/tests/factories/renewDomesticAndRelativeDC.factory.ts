import { faker } from '@faker-js/faker';
import { RenewDomesticAndRelativeDCCreationAttributes } from '../../database/models/card/domesticAndRelative/renewdomesticandrelativedc';
import { EDocumentState } from '../../src/types/card.types';
import { StatusEnum } from '../../src/types';

export class RenewDomesticAndRelativeDCFactory {
  static buildMinimal(
    previousCardId: string,
    overrides: Partial<RenewDomesticAndRelativeDCCreationAttributes> = {}
  ): RenewDomesticAndRelativeDCCreationAttributes {
    return {
      previousCardId,
      cardNumber: `RDR-${faker.string.numeric(4)}-${faker.string.numeric(3)}-${new Date().getFullYear()}`,
      status: StatusEnum.ACTIVE,
      documentStage: EDocumentState.PENDING,
      expired: false,
      ...overrides,
    };
  }

  static buildPrinted(
    previousCardId: string,
    overrides: Partial<RenewDomesticAndRelativeDCCreationAttributes> = {}
  ): RenewDomesticAndRelativeDCCreationAttributes {
    return this.buildMinimal(previousCardId, {
      documentStage: EDocumentState.PRINTED,
      issueDate: faker.date.recent(),
      validUntil: faker.date.future({ years: 1 }),
      ...overrides,
    });
  }
}
