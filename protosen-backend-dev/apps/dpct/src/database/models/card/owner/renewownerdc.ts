'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { OwnerDiplomaticCard } from './ownerdiplomaticcard';
import { StatusEnum } from '@shared/types/common.types';
import { EDocumentState } from '@modules/cards/types';

export interface RenewOwnerDCAttributes {
  id: string;
  rejectReason?: string | null;
  status: string;
  documentStage: string;
  cardNumber: string;
  newDateEndOfMission?: Date | null;
  expired: boolean;
  previousCardId: string;
  issueDate?: Date | null;
  validUntil?: Date | null;
  type_card?: string | null;
  color?: string | null;
  plaque?: string | null;
  observation?: string | null;
  creatorId?: string | null;
  organismId?: string | null;
}

export interface RenewOwnerDCCreationAttributes extends Partial<RenewOwnerDCAttributes> { }

// Interface avec associations pour un typage complet
export interface RenewOwnerDCWithAssociations extends RenewOwnerDCAttributes {
  previousCard?: OwnerDiplomaticCard;
}

export class RenewOwnerDC extends Model<InferAttributes<RenewOwnerDC>, InferCreationAttributes<RenewOwnerDC>>
  implements RenewOwnerDCAttributes {
  declare id: CreationOptional<string>;
  declare rejectReason?: string | null;
  declare status: string;
  declare documentStage: string;
  declare cardNumber: string;
  declare newDateEndOfMission?: Date | null;
  declare expired: boolean;
  declare previousCardId: string;
  declare issueDate?: Date | null;
  declare validUntil?: Date | null;
  declare type_card?: string | null;
  declare color?: string | null;
  declare plaque?: string | null;
  declare observation?: string | null;
  declare creatorId?: string | null;
  declare organismId?: string | null;

  static associate(models: any) {
    RenewOwnerDC.belongsTo(models.OwnerDiplomaticCard, {
      foreignKey: 'previousCardId',
      as: 'previousCard',
    });
  }

  // Associations
  declare previousCard?: OwnerDiplomaticCard;
}

export default (sequelize: Sequelize) => {

  RenewOwnerDC.init(
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
      cardNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      newDateEndOfMission: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      expired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      previousCardId: {
        type: DataTypes.UUID,
        allowNull: false,
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
      modelName: 'RenewOwnerDC',
      tableName: 'renewOwnerDCs',
    },
  );
  return RenewOwnerDC;
};
