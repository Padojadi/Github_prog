'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { OtherDependantDC } from './otherdependantdc';
import { RenewOtherDependantDC } from './renewotherdependantdc';
import { StatusEnum } from '@shared/types/common.types';
import { EDocumentState } from '@modules/cards/types';

export interface OtherDependantDuplicataDCAttributes {
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

export interface OtherDependantDuplicataDCCreationAttributes extends Partial<OtherDependantDuplicataDCAttributes> {}

// Interface avec associations pour un typage complet
export interface OtherDependantDuplicataDCWithAssociations extends OtherDependantDuplicataDCAttributes {
  previousCard?: OtherDependantDC;
  renewCard?: RenewOtherDependantDC;
}

export class OtherDependantDuplicataDC extends Model<InferAttributes<OtherDependantDuplicataDC>, InferCreationAttributes<OtherDependantDuplicataDC>>
  implements OtherDependantDuplicataDCAttributes {
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
  declare previousCard?: OtherDependantDC;
  declare renewCard?: RenewOtherDependantDC;

  static associate(models: any) {
    OtherDependantDuplicataDC.belongsTo(models.OtherDependantDC, {
      foreignKey: 'previousCardId',
      as: 'previousCard',
    });
    OtherDependantDuplicataDC.belongsTo(models.RenewOtherDependantDC, {
      foreignKey: 'renewCardId',
      as: 'renewCard',
    });
  }
}

export default (sequelize: Sequelize) => {

  OtherDependantDuplicataDC.init(
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
      modelName: 'OtherDependantDuplicataDC',
      tableName: 'otherDependantDuplicataDCs',
    },
  );
  return OtherDependantDuplicataDC;
};
