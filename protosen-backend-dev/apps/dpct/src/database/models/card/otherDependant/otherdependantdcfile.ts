'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { OtherDependantDC } from './otherdependantdc';

export interface OtherDependantDiplomaticCardFileAttributes {
  id: string;
  passportKey?: string | null;
  adKey?: string | null;
  photoKey?: string | null;
  othersKey?: string[] | null;
  otherDependantDCId: string;
}

export interface OtherDependantDiplomaticCardFileCreationAttributes extends Partial<OtherDependantDiplomaticCardFileAttributes> {}

// Interface avec associations pour un typage complet
export interface OtherDependantDCFileWithAssociations extends OtherDependantDiplomaticCardFileAttributes {
  OtherDependantDiplomaticCard?: OtherDependantDC;
}

export class OtherDependantDCFile extends Model<InferAttributes<OtherDependantDCFile>, InferCreationAttributes<OtherDependantDCFile>>
  implements OtherDependantDiplomaticCardFileAttributes {
  declare id: CreationOptional<string>;
  declare passportKey?: string | null;
  declare adKey?: string | null;
  declare photoKey?: string | null;
  declare othersKey?: string[] | null;
  declare otherDependantDCId: string;

  // Associations
  declare OtherDependantDiplomaticCard?: OtherDependantDC;

  static associate(models: any) {
    OtherDependantDCFile.belongsTo(models.OtherDependantDC, {
      foreignKey: 'otherDependantDCId',
      as: 'OtherDependantDiplomaticCard',
    });
  }
}

export default (sequelize: Sequelize) => {

  OtherDependantDCFile.init(
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
      },
      otherDependantDCId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OtherDependantDCFile',
      tableName: 'otherDependantDCFiles',
    },
  );
  return OtherDependantDCFile;
};
