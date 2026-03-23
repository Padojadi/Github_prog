'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';

export interface PlaqueAttributes {
  id: string;
  code: string;
  title: string;
}

export interface PlaqueCreationAttributes extends Partial<PlaqueAttributes> {}

export class Plaque extends Model<InferAttributes<Plaque>, InferCreationAttributes<Plaque>>
  implements PlaqueAttributes {
  declare id: CreationOptional<string>;
  declare code: string;
  declare title: string;

  static associate(_models: any) {
    // define association here
  }
}
export default (sequelize: Sequelize) => {

  Plaque.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(4),
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Plaque',
      tableName: 'Plaque',
      timestamps: false,
    },
  );
  return Plaque;
};
