import { CreationOptional, DataTypes, Deferrable, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { StatusEnum } from "@shared/types/common.types";
import institution, { Institution } from "./institution";
import { AccessGroup } from "./accessgroup";
import { OwnerDiplomaticCard } from "./card/owner/ownerdiplomaticcard";
import { RoleEnum } from "@modules/user/types";
import { generateRandomCode } from "@shared/utils/functions";

export interface UserAttributes {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone?: string | null;
  role: RoleEnum;
  verification_code?: string | null;
  verification_code_ttl?: Date | null;
  status: StatusEnum;
  confirmed: boolean;
  deleted: boolean;
  accessGroupId: string;
  organismId: string;
}

export interface UserCreationAttributes extends Partial<UserAttributes> { }

// Interface avec associations pour un typage complet
export interface UserWithAssociations extends UserAttributes {
  accessGroup?: AccessGroup;
  organism?: Institution;
  cartesDiplomatiques?: OwnerDiplomaticCard[];
}

export class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>> implements UserAttributes {
  declare id: CreationOptional<string>;
  declare email: string;
  declare first_name: string;
  declare last_name: string;
  declare password: string;
  declare phone?: string | null;
  declare role: RoleEnum;
  declare verification_code?: string | null;
  declare verification_code_ttl?: Date | null;
  declare status: StatusEnum;
  declare confirmed: boolean;
  declare deleted: boolean;
  declare accessGroupId: string;
  declare organismId: string;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   */
  static associate(models: any) {
    User.hasMany(models.OwnerDiplomaticCard, {
      foreignKey: 'creatorId',
      as: 'cartesDiplomatiques',
      onDelete: 'CASCADE',
    });
    User.belongsTo(models.AccessGroup, {
      foreignKey: 'accessGroupId',
      as: 'accessGroup',
    });
    User.belongsTo(models.Institution, {
      foreignKey: 'organismId',
      as: 'organism',
    });
  }

  // Associations
  // `declare` indique à TS que la propriété vient des associations Sequelize et n'est pas initialisée dans le constructeur
  // ✅ `declare` car la propriété est injectée par Sequelize, ❌ pas `public` car elle n'est pas réellement initialisée dans la classe
  declare accessGroup?: AccessGroup;
  declare organism?: Institution;
  declare cartesDiplomatiques?: OwnerDiplomaticCard[]; // Assuming this is an array of OwnerDiplomaticCard or similar

  toJSON(): Record<string, any> {
    return {
      ...this.get(),
      password: undefined,
      verification_code_ttl: undefined,
      verification_code: undefined,
      // role: undefined,
    };
  }
}

export default (sequelize: Sequelize) => {
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(RoleEnum)),
      defaultValue: RoleEnum.USER,
    },
    verification_code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    verification_code_ttl: {
      allowNull: true,
      type: DataTypes.DATE(20),
    },
    status: {
      type: DataTypes.ENUM(...Object.values(StatusEnum)),
      defaultValue: StatusEnum.ACTIVE,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    accessGroupId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    organismId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'organism',
      references: {
        model: institution(sequelize),
        key: 'id',
        deferrable: Deferrable.INITIALLY_IMMEDIATE(),
      },
    }
  }, {
    hooks: {
      beforeCreate: (user, _options) => {
        user.verification_code = generateRandomCode();
        user.verification_code_ttl = new Date(Date.now() + 15 * 60 * 1000);
      },
      beforeUpdate: (user, _options) => {
        if (user.verification_code_ttl && user.verification_code_ttl < new Date()) {
          user.verification_code = null;
          user.verification_code_ttl = null;
        }
      },
    },
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });
  return User;
};