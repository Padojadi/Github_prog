'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { EDemandType, EDocumentState } from '@modules/cards/types';
import { ChildDCFile } from './childdcfile';
import { OwnerDiplomaticCard } from '../owner/ownerdiplomaticcard';
import { User } from '../../user';
import { Institution } from '../../institution';
import { RenewChildDC } from './renewchilddc';
import { EGenderEnum, StatusEnum } from '@shared/types/common.types';

export interface ChildDCAttributes {
  id: string;
  cardNumber?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  citizenship: string;
  countryOfBirth: string;
  travellingNumber: string;
  deliverAt: string;
  deliverBy: string;
  deliverThe: Date;
  issueDate?: Date | null;
  travellingTitleType: string;
  travellingTitleValidUntil: string;
  rejectReason?: string | null;
  status: string;
  documentStage: string;
  demandType: string;
  expired: boolean;
  validUntil?: Date | null;
  type_card?: string | null;
  color?: string | null;
  description?: string | null;
  observation?: string | null;
  ownerDiplomaticCardId: string;
  creatorId: string;
  organismId: string;
}

export interface ChildDCCreationAttributes extends Partial<ChildDCAttributes> {}

// Interface avec associations pour un typage complet
export interface ChildDCWithAssociations extends ChildDCAttributes {
  childDCFiles?: ChildDCFile;
  ownerDiplomaticCard?: OwnerDiplomaticCard;
  creator?: User;
  organism?: Institution;
  renewals?: RenewChildDC[];
}

export class ChildDC extends Model<InferAttributes<ChildDC>, InferCreationAttributes<ChildDC>>
  implements ChildDCAttributes {
  declare id: CreationOptional<string>;
  declare cardNumber?: string | null;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phone: string;
  declare gender: string;
  declare dateOfBirth: Date;
  declare placeOfBirth: string;
  declare citizenship: string;
  declare countryOfBirth: string;
  declare travellingNumber: string;
  declare deliverAt: string;
  declare deliverBy: string;
  declare deliverThe: Date;
  declare issueDate?: Date | null;
  declare travellingTitleType: string;
  declare travellingTitleValidUntil: string;
  declare rejectReason?: string | null;
  declare status: string;
  declare documentStage: string;
  declare demandType: string;
  declare expired: boolean;
  declare validUntil?: Date | null;
  declare type_card?: string | null;
  declare color?: string | null;
  declare description?: string | null;
  declare observation?: string | null;
  declare ownerDiplomaticCardId: string;
  declare creatorId: string;
  declare organismId: string;

  // Associations
  declare childDCFiles?: ChildDCFile;
  declare ownerDiplomaticCard?: OwnerDiplomaticCard;
  declare creator?: User;
  declare organism?: Institution;
  declare renewals?: RenewChildDC[];

  static associate(models: any) {
    ChildDC.hasOne(models.ChildDCFile, {
      foreignKey: 'childDCId',
      as: 'childDCFiles',
    });
    ChildDC.belongsTo(models.OwnerDiplomaticCard, {
      foreignKey: 'ownerDiplomaticCardId',
      as: 'ownerDiplomaticCard',
    });
    ChildDC.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator',
    });
    ChildDC.belongsTo(models.Institution, {
      foreignKey: 'organismId',
      as: 'organism',
    });
    ChildDC.hasMany(models.RenewChildDC, {
      foreignKey: 'previousCardId',
      as: 'renewals',
    });
  }
}

export default (sequelize: Sequelize) => {
  ChildDC.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      cardNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM(...Object.values(EGenderEnum)),
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      placeOfBirth: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      citizenship: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      countryOfBirth: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      travellingNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'number', // Database column is 'number' in production
      },
      deliverAt: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      deliverBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      deliverThe: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      issueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      travellingTitleType: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      travellingTitleValidUntil: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
      demandType: {
        type: DataTypes.ENUM(...Object.values(EDemandType)),
        allowNull: false,
        defaultValue: EDemandType.NEW,
      },
      expired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      observation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ownerDiplomaticCardId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      organismId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ChildDC',
      tableName: 'childDCs',
    },
  );
  return ChildDC;
};
