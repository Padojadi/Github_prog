'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { ChildDC } from './childdc';

export interface ChildDiplomaticCardFileAttributes {
  id: string;
  passportKey?: string | null;
  anKey?: string | null;
  photoKey?: string | null;
  othersKey?: string[] | null;
  childDCId: string;
}

export interface ChildDiplomaticCardFileCreationAttributes extends Partial<ChildDiplomaticCardFileAttributes> {}

// Interface avec associations pour un typage complet
export interface ChildDCFileWithAssociations extends ChildDiplomaticCardFileAttributes {
  ChildDC?: ChildDC;
}

export class ChildDCFile extends Model<InferAttributes<ChildDCFile>, InferCreationAttributes<ChildDCFile>>
  implements ChildDiplomaticCardFileAttributes {
  declare id: CreationOptional<string>;
  declare passportKey?: string | null;
  declare anKey?: string | null;
  declare photoKey?: string | null;
  declare othersKey?: string[] | null;
  declare childDCId: string;

  // Associations
  declare ChildDC?: ChildDC;

  static associate(models: any) {
    ChildDCFile.belongsTo(models.ChildDC, {
      foreignKey: 'childDCId',
      as: 'ChildDC',
    });
  }
}

export default (sequelize: Sequelize) => {

  ChildDCFile.init(
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
      anKey: {
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
      childDCId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ChildDCFile',
      tableName: 'childDCFiles',
    },
  );
  return ChildDCFile;
};
