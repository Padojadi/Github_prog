'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { StrictStatusEnum } from '@shared/types/common.types';

export interface InstitutionAttributes {
  id: string;
  institutionType: string;
  code: string;
  libelle: string;
  service: string;
  status: StrictStatusEnum;
}

export interface InstitutionCreationAttributes extends Partial<InstitutionAttributes> { }

export class Institution extends Model<InferAttributes<Institution>, InferCreationAttributes<Institution>>
  implements InstitutionAttributes {
  declare id: CreationOptional<string>;
  declare institutionType: string;
  declare code: string;
  declare libelle: string;
  declare service: string;
  declare status: StrictStatusEnum;

  static associate(_models: any) {
    // define association here
  }
}

export default (sequelize: Sequelize) => {
  Institution.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      institutionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      libelle: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      service: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      status: {
        type: DataTypes.ENUM(...Object.values(StrictStatusEnum)),
        defaultValue: StrictStatusEnum.ACTIVE,
      },
    },
    {
      sequelize,
      modelName: 'Institution',
      tableName: 'institutions',
    },
  );
  return Institution;
};
