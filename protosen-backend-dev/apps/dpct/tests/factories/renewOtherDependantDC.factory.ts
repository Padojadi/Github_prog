import { faker } from '@faker-js/faker';
import { RenewOtherDependantDCCreationAttributes } from '../../database/models/card/otherDependant/renewotherdependantdc';
import { EDocumentState } from '../../src/types/card.types';
import { StatusEnum } from '../../src/types';

export class RenewOtherDependantDCFactory {
  static buildMinimal(
    previousCardId: string,
    overrides: Partial<RenewOtherDependantDCCreationAttributes> = {}
  ): RenewOtherDependantDCCreationAttributes {
    return {
      previousCardId,
      cardNumber: `ROD-${faker.string.numeric(4)}-${faker.string.numeric(3)}-${new Date().getFullYear()}`,
      status: StatusEnum.ACTIVE,
      documentStage: EDocumentState.PENDING,
      expired: false,
      ...overrides,
    };
  }

  static buildPrinted(
    previousCardId: string,
    overrides: Partial<RenewOtherDependantDCCreationAttributes> = {}
  ): RenewOtherDependantDCCreationAttributes {
    return this.buildMinimal(previousCardId, {
      documentStage: EDocumentState.PRINTED,
      issueDate: faker.date.recent(),
      validUntil: faker.date.future({ years: 1 }),
      ...overrides,
    });
  }
}
