'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { OtherStaffDC } from './otherstaffdc';
import { RenewOtherStaffDC } from './renewotherstaffdc';
import { StatusEnum } from '@shared/types/common.types';
import { EDocumentState } from '@modules/cards/types';

export interface OtherStaffDuplicataDCAttributes {
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

export interface OtherStaffDuplicataDCCreationAttributes extends Partial<OtherStaffDuplicataDCAttributes> {}

// Interface avec associations pour un typage complet
export interface OtherStaffDuplicataDCWithAssociations extends OtherStaffDuplicataDCAttributes {
  previousCard?: OtherStaffDC;
  renewCard?: RenewOtherStaffDC;
}

export class OtherStaffDuplicataDC extends Model<InferAttributes<OtherStaffDuplicataDC>, InferCreationAttributes<OtherStaffDuplicataDC>>
  implements OtherStaffDuplicataDCAttributes {
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
  declare previousCard?: OtherStaffDC;
  declare renewCard?: RenewOtherStaffDC;

  static associate(models: any) {
    OtherStaffDuplicataDC.belongsTo(models.OtherStaffDC, {
      foreignKey: 'previousCardId',
      as: 'previousCard',
    });
    OtherStaffDuplicataDC.belongsTo(models.RenewOtherStaffDC, {
      foreignKey: 'renewCardId',
      as: 'renewCard',
    });
  }
}

export default (sequelize: Sequelize) => {

  OtherStaffDuplicataDC.init(
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
      modelName: 'OtherStaffDuplicataDC',
      tableName: 'otherStaffDuplicataDCs',
    },
  );
  return OtherStaffDuplicataDC;
};
