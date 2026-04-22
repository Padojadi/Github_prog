'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';

export interface SpouseDiplomaticCardFileAttributes {
  id: string;
  passportKey: string;
  amKey: string;
  photoKey: string;
  othersKey: string[];
  spouseDCId: string;
}

export interface SpouseDiplomaticCardFileCreationAttributes extends Partial<SpouseDiplomaticCardFileAttributes> {}

export class SpouseDCFile extends Model<InferAttributes<SpouseDCFile>, InferCreationAttributes<SpouseDCFile>>
  implements SpouseDiplomaticCardFileAttributes {
  declare id: CreationOptional<string>;
  declare passportKey: string;
  declare amKey: string;
  declare photoKey: string;
  declare othersKey: string[];
  declare spouseDCId: string;

  static associate(models: any) {
    SpouseDCFile.belongsTo(models.SpouseDC, {
      foreignKey: 'spouseDCId',
      as: 'SpouseDiplomaticCard',
    });
  }
}

export default (sequelize: Sequelize) => {

  SpouseDCFile.init(
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
      amKey: {
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
      spouseDCId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SpouseDCFile',
      tableName: 'spouseDCFiles',
    },
  );
  return SpouseDCFile;
};
