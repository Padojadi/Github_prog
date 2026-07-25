'use strict';
import { CreationOptional, DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { OwnerDiplomaticCard } from './ownerdiplomaticcard';

export interface OwnerDiplomaticCardFileAttributes {
  id: string;
  passportKey?: string | null;
  lcKey?: string | null;
  photoKey?: string | null;
  othersKey?: string[] | null;
  ownerDiplomaticCardId: string;
}

export interface OwnerDiplomaticCardFileCreationAttributes extends Partial<OwnerDiplomaticCardFileAttributes> {}

// Interface avec associations pour un typage complet
export interface OwnerDiplomaticCardFileWithAssociations extends OwnerDiplomaticCardFileAttributes {
  OwnerDiplomaticCard?: OwnerDiplomaticCard;
}

export class OwnerDiplomaticCardFile extends Model<InferAttributes<OwnerDiplomaticCardFile>, InferCreationAttributes<OwnerDiplomaticCardFile>>
  implements OwnerDiplomaticCardFileAttributes {
  declare id: CreationOptional<string>;
  declare passportKey?: string | null;
  declare lcKey?: string | null;
  declare photoKey?: string | null;
  declare othersKey?: string[] | null;
  declare ownerDiplomaticCardId: string;

  static associate(models: any) {
    OwnerDiplomaticCardFile.belongsTo(models.OwnerDiplomaticCard, {
      foreignKey: 'ownerDiplomaticCardId',
      as: 'OwnerDiplomaticCard',
    });
  }

  // Associations
  declare OwnerDiplomaticCard?: OwnerDiplomaticCard;
}
export default (sequelize: Sequelize) => {

  OwnerDiplomaticCardFile.init(
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
      lcKey: {
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
      ownerDiplomaticCardId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OwnerDiplomaticCardFile',
      tableName: 'OwnerDiplomaticCardFiles',
    },
  );
  return OwnerDiplomaticCardFile;
};
