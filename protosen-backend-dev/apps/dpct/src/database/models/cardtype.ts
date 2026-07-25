'use strict';
import { Model, DataTypes, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export interface CardTypeAttributes {
  id: string;
  name: string;
  description?: string | null;
  observation: string[];
  color?: string | null;
}

export interface CardTypeCreationAttributes extends Partial<CardTypeAttributes> {}

export class CardType
  extends Model<InferAttributes<CardType>, InferCreationAttributes<CardType>>
  implements CardTypeAttributes
{
  declare id: CreationOptional<string>;
  declare name: string;
  declare description?: string | null;
  declare observation: string[];
  declare color?: string | null;

  static associate(_models: any) {
    // define association here
  }
}

export default (sequelize: Sequelize) => {

  CardType.init(
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      observation: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'CardType',
      tableName: 'CardType',
      timestamps: false,
    },
  );

  return CardType;
};
