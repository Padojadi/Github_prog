'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { OtherStaffDCFile } from './otherstaffdcfile';
import { OwnerDiplomaticCard } from '../owner/ownerdiplomaticcard';
import { User } from '../../user';
import { Institution } from '../../institution';
import { RenewOtherStaffDC } from './renewotherstaffdc';
import { EGenderEnum, StatusEnum } from '@shared/types/common.types';
import { EDemandType, EDocumentState } from '@modules/cards/types';

export interface OtherStaffDCAttributes {
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

export interface OtherStaffDCCreationAttributes extends Partial<OtherStaffDCAttributes> {}

// Interface avec associations pour un typage complet
export interface OtherStaffDCWithAssociations extends OtherStaffDCAttributes {
  otherStaffDCFiles?: OtherStaffDCFile;
  ownerDiplomaticCard?: OwnerDiplomaticCard;
  creator?: User;
  organism?: Institution;
  renewals?: RenewOtherStaffDC[];
}

export class OtherStaffDC extends Model<InferAttributes<OtherStaffDC>, InferCreationAttributes<OtherStaffDC>>
  implements OtherStaffDCAttributes {
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
  declare otherStaffDCFiles?: OtherStaffDCFile;
  declare ownerDiplomaticCard?: OwnerDiplomaticCard;
  declare creator?: User;
  declare organism?: Institution;
  declare renewals?: RenewOtherStaffDC[];

  static associate(models: any) {
    OtherStaffDC.hasOne(models.OtherStaffDCFile, {
      foreignKey: 'otherStaffDCId',
      as: 'otherStaffDCFiles',
    });
    OtherStaffDC.belongsTo(models.OwnerDiplomaticCard, {
      foreignKey: 'ownerDiplomaticCardId',
      as: 'ownerDiplomaticCard',
    });
    OtherStaffDC.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator',
    });
    OtherStaffDC.belongsTo(models.Institution, {
      foreignKey: 'organismId',
      as: 'organism',
    });
    OtherStaffDC.hasMany(models.RenewOtherStaffDC, {
      foreignKey: 'previousCardId',
      as: 'renewals',
    });
  }
}

export default (sequelize: Sequelize) => {

  OtherStaffDC.init(
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
      modelName: 'OtherStaffDC',
      tableName: 'otherStaffDCs',
    },
  );
  return OtherStaffDC;
};
