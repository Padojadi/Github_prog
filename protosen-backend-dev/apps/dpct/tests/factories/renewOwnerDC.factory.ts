import { faker } from '@faker-js/faker';
import { RenewOwnerDCCreationAttributes } from '../../database/models/card/owner/renewownerdc';
import { EDocumentState } from '../../src/types/card.types';
import { StatusEnum } from '../../src/types';

/**
 * Factory for creating RenewOwnerDC test data
 */
export class RenewOwnerDCFactory {
  /**
   * Build minimal RenewOwnerDC data (only required fields)
   */
  static buildMinimal(
    previousCardId: string,
    overrides: Partial<RenewOwnerDCCreationAttributes> = {}
  ): RenewOwnerDCCreationAttributes {
    return {
      previousCardId,
      cardNumber: `RO-${faker.string.numeric(4)}-${faker.string.numeric(3)}-${new Date().getFullYear()}`,
      status: StatusEnum.ACTIVE,
      documentStage: EDocumentState.PENDING,
      expired: false,
      ...overrides,
    };
  }

  /**
   * Build printed RenewOwnerDC
   */
  static buildPrinted(
    previousCardId: string,
    overrides: Partial<RenewOwnerDCCreationAttributes> = {}
  ): RenewOwnerDCCreationAttributes {
    return this.buildMinimal(previousCardId, {
      documentStage: EDocumentState.PRINTED,
      issueDate: faker.date.recent(),
      validUntil: faker.date.future({ years: 1 }),
      ...overrides,
    });
  }

  /**
   * Build with specific document stage
   */
  static buildWithStage(
    previousCardId: string,
    stage: EDocumentState,
    overrides: Partial<RenewOwnerDCCreationAttributes> = {}
  ): RenewOwnerDCCreationAttributes {
    return this.buildMinimal(previousCardId, {
      documentStage: stage,
      ...overrides,
    });
  }
}
