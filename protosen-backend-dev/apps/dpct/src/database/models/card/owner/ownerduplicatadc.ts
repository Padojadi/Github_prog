'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { OwnerDiplomaticCard } from './ownerdiplomaticcard';
import { RenewOwnerDC } from './renewownerdc';
import { StatusEnum } from '@shared/types/common.types';
import { EDocumentState } from '@modules/cards/types';

export interface OwnerDuplicataDCAttributes {
  id: string;
  rejectReason?: string | null;
  status: string;
  documentStage: string;
  previousCardId?: string | null;
  renewCardId?: string | null;
  issueDate?: Date | null;
  validUntil?: Date | null;
  type_card?: string | null;
  color?: string | null;
  plaque?: string | null;
  observation?: string | null;
  creatorId?: string | null;
  organismId?: string | null;
}

export interface OwnerDuplicataDCCreationAttributes extends Partial<OwnerDuplicataDCAttributes> {}

// Interface avec associations pour un typage complet
export interface OwnerDuplicataDCWithAssociations extends OwnerDuplicataDCAttributes {
  previousCard?: OwnerDiplomaticCard;
  renewCard?: RenewOwnerDC;
}

export class OwnerDuplicataDC extends Model<InferAttributes<OwnerDuplicataDC>, InferCreationAttributes<OwnerDuplicataDC>>
  implements OwnerDuplicataDCAttributes {
  declare id: CreationOptional<string>;
  declare rejectReason?: string | null;
  declare status: string;
  declare documentStage: string;
  declare previousCardId?: string | null;
  declare renewCardId?: string | null;
  declare issueDate?: Date | null;
  declare validUntil?: Date | null;
  declare type_card?: string | null;
  declare color?: string | null;
  declare plaque?: string | null;
  declare observation?: string | null;
  declare creatorId?: string | null;
  declare organismId?: string | null;

  // Associations
  declare previousCard?: OwnerDiplomaticCard;
  declare renewCard?: RenewOwnerDC;

  static associate(models: any) {
    OwnerDuplicataDC.belongsTo(models.OwnerDiplomaticCard, {
      foreignKey: 'previousCardId',
      as: 'previousCard',
    });
    OwnerDuplicataDC.belongsTo(models.RenewOwnerDC, {
      foreignKey: 'renewCardId',
      as: 'renewCard',
    });
  }
}

export default (sequelize: Sequelize) => {

  OwnerDuplicataDC.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      rejectReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(StatusEnum)),
        allowNull: false,
        defaultValue: StatusEnum.ACTIVE,
      },
      documentStage: {
        type: DataTypes.ENUM(...Object.values(EDocumentState)),
        allowNull: false,
        defaultValue: EDocumentState.ONHOLD,
      },
      previousCardId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      renewCardId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      issueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      validUntil: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      type_card: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      color: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      plaque: {
        type: DataTypes.STRING(4),
        allowNull: true,
      },
      observation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      organismId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'OwnerDuplicataDC',
      tableName: 'ownerDuplicataDCs',
    },
  );
  return OwnerDuplicataDC;
};
