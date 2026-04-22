'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { DomesticAndRelativeDC } from './domesticandrelativedc';

export interface DomesticAndRelativeDiplomaticCardFileAttributes {
  id: string;
  passportKey?: string | null;
  adKey?: string | null;
  photoKey?: string | null;
  othersKey?: string[] | null;
  domesticAndRelativeDCId: string;
}

export interface DomesticAndRelativeDiplomaticCardFileCreationAttributes extends Partial<DomesticAndRelativeDiplomaticCardFileAttributes> {}

// Interface avec associations pour un typage complet
export interface DomesticAndRelativeDCFileWithAssociations extends DomesticAndRelativeDiplomaticCardFileAttributes {
  DomesticAndRelativeDiplomaticCard?: DomesticAndRelativeDC;
}

export class DomesticAndRelativeDCFile extends Model<InferAttributes<DomesticAndRelativeDCFile>, InferCreationAttributes<DomesticAndRelativeDCFile>>
  implements DomesticAndRelativeDiplomaticCardFileAttributes {
  declare id: CreationOptional<string>;
  declare passportKey?: string | null;
  declare adKey?: string | null;
  declare photoKey?: string | null;
  declare othersKey?: string[] | null;
  declare domesticAndRelativeDCId: string;

  // Associations
  declare DomesticAndRelativeDiplomaticCard?: DomesticAndRelativeDC;

  static associate(models: any) {
    DomesticAndRelativeDCFile.belongsTo(models.DomesticAndRelativeDC, {
      foreignKey: 'domesticAndRelativeDCId',
      as: 'DomesticAndRelativeDiplomaticCard',
    });
  }
}

export default (sequelize: Sequelize) => {

  DomesticAndRelativeDCFile.init(
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
        field: 'otthersKey', // Database column has typo with two 't's
      },
      domesticAndRelativeDCId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'DomesticAndRelativeDCFile',
      tableName: 'domesticAndRelativeDCFiles',
    },
  );
  return DomesticAndRelativeDCFile;
};
