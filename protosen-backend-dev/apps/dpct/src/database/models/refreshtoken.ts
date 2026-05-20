'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { User } from './user';

export interface RefreshTokenAttributes {
  id: string;
  token: string;
  expiresAt: Date;
  userId: string;
}

export interface RefreshTokenCreationAttributes extends Partial<RefreshTokenAttributes> { }

// Interface avec associations pour un typage complet
export interface RefreshTokenWithAssociations extends RefreshTokenAttributes {
  user?: User;
}

export class RefreshToken extends Model<InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>>
  implements RefreshTokenAttributes {
  declare id: CreationOptional<string>;
  declare token: string;
  declare expiresAt: Date;
  declare userId: string;

  static associate(models: any) {
    // define association here
    RefreshToken.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }

  // Associations
  declare user?: User;

}
export default (sequelize: Sequelize) => {

  RefreshToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'RefreshToken',
      tableName: 'refreshTokens',
    },
  );
  return RefreshToken;
};
