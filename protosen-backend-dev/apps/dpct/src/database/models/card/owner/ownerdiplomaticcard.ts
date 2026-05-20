'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { OwnerDiplomaticCardFile } from './ownerdiplomaticcardfile';
import { User } from 'database/models/user';
import { Institution } from 'database/models/institution';
import { RenewOwnerDC } from './renewownerdc';
import { EGenderEnum, StatusEnum } from '@shared/types/common.types';
import { EDocumentState } from '@modules/cards/types';

export interface OwnerDiplomaticCardAttributes {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  matrimonialStatus: string;
  gender: string;
  plaque?: string | null;
  dateOfBirth: Date;
  placeOfBirth: string;
  citizenship: string;
  countryOfBirth: string;
  grade: string;
  personReplaced?: string | null;
  cardNumber?: string | null;
  jobFunction: string;
  travellingNumber: string;
  deliverAt: string;
  deliverBy: string;
  deliverThe: Date;
  issueDate?: Date | null;
  travellingTitleType: string;
  dateTakingOffice: Date;
  dateArrivalSenegal: Date;
  travellingTitleValidUntil: Date;
  dateEndOfMission: Date;
  lastCityAbroad: string;
  adressSenegal?: string | null;
  lastCountryAbroad: string;
  latestOfWorkCountry: string;
  latestWorkStructure: string;
  lastestWorkDate: Date;
  lastStreetAbroad: string;
  rejectReason?: string | null;
  status: string;
  documentStage: string;
  validUntil?: Date | null;
  expired: boolean;
  type_card?: string | null;
  color?: string | null;
  description?: string | null;
  observation?: string | null;
  creatorId: string;
  organismId: string;
}

export interface OwnerDiplomaticCardCreationAttributes extends Partial<OwnerDiplomaticCardAttributes> { }

// Interface avec associations pour un typage complet
export interface OwnerDiplomaticCardWithAssociations extends OwnerDiplomaticCardAttributes {
  ownerDiplomaticCardFiles?: OwnerDiplomaticCardFile;
  creator?: User;
  organism?: Institution;
  renewals?: RenewOwnerDC[];
}

export class OwnerDiplomaticCard extends Model<InferAttributes<OwnerDiplomaticCard>, InferCreationAttributes<OwnerDiplomaticCard>>
  implements OwnerDiplomaticCardAttributes {
  declare id: CreationOptional<string>;
  declare title: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phone: string;
  declare matrimonialStatus: string;
  declare gender: string;
  declare plaque?: string | null;
  declare dateOfBirth: Date;
  declare placeOfBirth: string;
  declare citizenship: string;
  declare countryOfBirth: string;
  declare grade: string;
  declare personReplaced?: string | null;
  declare cardNumber?: string | null;
  declare jobFunction: string;
  declare travellingNumber: string;
  declare deliverAt: string;
  declare deliverBy: string;
  declare deliverThe: Date;
  declare issueDate?: Date | null;
  declare travellingTitleType: string;
  declare dateTakingOffice: Date;
  declare dateArrivalSenegal: Date;
  declare travellingTitleValidUntil: Date;
  declare dateEndOfMission: Date;
  declare lastCityAbroad: string;
  declare adressSenegal?: string | null;
  declare lastCountryAbroad: string;
  declare latestOfWorkCountry: string;
  declare latestWorkStructure: string;
  declare lastestWorkDate: Date;
  declare lastStreetAbroad: string;
  declare rejectReason?: string | null;
  declare status: string;
  declare documentStage: string;
  declare validUntil?: Date | null;
  declare expired: boolean;
  declare type_card?: string | null;
  declare color?: string | null;
  declare description?: string | null;
  declare observation?: string | null;
  declare creatorId: string;
  declare organismId: string;

  static associate(models: any) {
    OwnerDiplomaticCard.hasOne(models.OwnerDiplomaticCardFile, {
      foreignKey: 'ownerDiplomaticCardId',
      as: 'ownerDiplomaticCardFiles',
    });
    OwnerDiplomaticCard.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator',
    });
    OwnerDiplomaticCard.belongsTo(models.Institution, {
      foreignKey: 'organismId',
      as: 'organism',
    });
    OwnerDiplomaticCard.hasMany(models.RenewOwnerDC, {
      foreignKey: 'previousCardId',
      as: 'renewals',
    });
  }

  // Associations
  declare ownerDiplomaticCardFiles?: OwnerDiplomaticCardFile;
  declare creator?: User;
  declare organism?: Institution;
  declare renewals?: RenewOwnerDC[];
}

export default (sequelize: Sequelize) => {

  OwnerDiplomaticCard.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
      matrimonialStatus: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM(...Object.values(EGenderEnum)),
        allowNull: false,
      },
      plaque: {
        type: DataTypes.STRING(4),
        allowNull: true,
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
      grade: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      personReplaced: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      cardNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      jobFunction: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      travellingNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'number',
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
      dateTakingOffice: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      dateArrivalSenegal: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      travellingTitleValidUntil: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      dateEndOfMission: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      lastCityAbroad: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      adressSenegal: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      lastCountryAbroad: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      latestOfWorkCountry: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      latestWorkStructure: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      lastestWorkDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      lastStreetAbroad: {
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
      validUntil: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      expired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      modelName: 'OwnerDiplomaticCard',
      tableName: 'OwnerDiplomaticCards',
    },
  );
  return OwnerDiplomaticCard;
};
