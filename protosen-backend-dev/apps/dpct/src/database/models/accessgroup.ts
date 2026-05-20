'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { User } from './user';

export interface AccessGroupAttributes {
  id: string;
  name: string;
  permissions: string[];
  editable: boolean;
}

export interface AccessGroupCreationAttributes extends Partial<AccessGroupAttributes> {}

// Interface avec associations pour un typage complet
export interface AccessGroupWithAssociations extends AccessGroupAttributes {
  users?: User[];
}

export class AccessGroup extends Model<InferAttributes<AccessGroup>, InferCreationAttributes<AccessGroup>>
  implements AccessGroupAttributes {
  declare id: CreationOptional<string>;
  declare name: string;
  declare permissions: string[];
  declare editable: boolean;

  static associate(models: any) {
    // define association here
    AccessGroup.hasMany(models.User, {
      foreignKey: 'accessGroupId',
      as: 'users',
    });
  }

  // Associations
  declare users?: User[];
}

export default (sequelize: Sequelize) => {

  AccessGroup.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permissions: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
      },
      editable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'AccessGroup',
      tableName: 'AccessGroup',
      timestamps: true,
    },
  );
  return AccessGroup;
};
