'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { OtherStaffDC } from './otherstaffdc';

export interface OtherStaffDiplomaticCardFileAttributes {
  id: string;
  passportKey?: string | null;
  adKey?: string | null;
  photoKey?: string | null;
  othersKey?: string[] | null;
  otherStaffDCId: string;
}

export interface OtherStaffDiplomaticCardFileCreationAttributes extends Partial<OtherStaffDiplomaticCardFileAttributes> {}

// Interface avec associations pour un typage complet
export interface OtherStaffDCFileWithAssociations extends OtherStaffDiplomaticCardFileAttributes {
  OtherStaffDiplomaticCard?: OtherStaffDC;
}

export class OtherStaffDCFile extends Model<InferAttributes<OtherStaffDCFile>, InferCreationAttributes<OtherStaffDCFile>>
  implements OtherStaffDiplomaticCardFileAttributes {
  declare id: CreationOptional<string>;
  declare passportKey?: string | null;
  declare adKey?: string | null;
  declare photoKey?: string | null;
  declare othersKey?: string[] | null;
  declare otherStaffDCId: string;

  // Associations
  declare OtherStaffDiplomaticCard?: OtherStaffDC;

  static associate(models: any) {
    OtherStaffDCFile.belongsTo(models.OtherStaffDC, {
      foreignKey: 'otherStaffDCId',
      as: 'OtherStaffDiplomaticCard',
    });
  }
}

export default (sequelize: Sequelize) => {

  OtherStaffDCFile.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      passportKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      adKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photoKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      othersKey: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        field: 'othersKey',
      },
      otherStaffDCId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OtherStaffDCFile',
      tableName: 'otherStaffDCFiles',
    },
  );
  return OtherStaffDCFile;
};
