'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';

export interface SystemSettingsAttributes {
  id: string;
  directorSignature: string | null;
  ministryName: string | null;
  protocolDirectionName: string | null;
}

export interface SystemSettingsCreationAttributes extends Partial<SystemSettingsAttributes> {}

export class SystemSettings extends Model<InferAttributes<SystemSettings>, InferCreationAttributes<SystemSettings>>
  implements SystemSettingsAttributes {
  declare id: CreationOptional<string>;
  declare directorSignature: string | null;
  declare ministryName: string | null;
  declare protocolDirectionName: string | null;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  static associate(_models: any) {
    // No associations needed for system settings
  }
}

export default (sequelize: Sequelize) => {
  SystemSettings.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      directorSignature: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ministryName: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      protocolDirectionName: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SystemSettings',
      tableName: 'system_settings',
      timestamps: true,
    },
  );
  return SystemSettings;
};
