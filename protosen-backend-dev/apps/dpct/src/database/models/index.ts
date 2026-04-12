import { Sequelize, Dialect, ModelStatic } from 'sequelize';
import { config as dotenvConfig } from 'dotenv';
import dbConfig from '../sequelize.config';
import initUser, { User } from './user';
import initAccessGroup, { AccessGroup } from './accessgroup';
import initInstitution, { Institution } from './institution';
import initCardType, { CardType } from './cardtype';
import initPlaque, { Plaque } from './plaque';
import initRefreshToken, { RefreshToken } from './refreshtoken'
import initOwnerDiplomaticCard, { OwnerDiplomaticCard } from './card/owner/ownerdiplomaticcard';
import initOwnerDiplomaticCardFile, { OwnerDiplomaticCardFile } from './card/owner/ownerdiplomaticcardfile';
import initRenewOwnerDC, { RenewOwnerDC } from './card/owner/renewownerdc';
import initOwnerDuplicataDC, { OwnerDuplicataDC } from './card/owner/ownerduplicatadc';
import initSpouseDC, { SpouseDC } from './card/spouse/spousedc';
import initSpouseDCFile, { SpouseDCFile } from './card/spouse/spousedcfile';
import initRenewSpouseDC, { RenewSpouseDC } from './card/spouse/renewspousedc';
import initSpouseDuplicataDC, { SpouseDuplicataDC } from './card/spouse/spouseduplicatadc';
import initChildDC, { ChildDC } from './card/child/childdc';
import initChildDCFile, { ChildDCFile } from './card/child/childdcfile';
import initRenewChildDC, { RenewChildDC } from './card/child/renewchilddc';
import initChildDuplicataDC, { ChildDuplicataDC } from './card/child/childduplicatadc';
import initDomesticAndRelativeDC, { DomesticAndRelativeDC } from './card/domesticAndRelative/domesticandrelativedc';
import initDomesticAndRelativeDuplicataDC, { DomesticAndRelativeDuplicataDC } from './card/domesticAndRelative/domesticandrelativeduplicatadc';
import initDomesticAndRelativeDCFile, { DomesticAndRelativeDCFile } from './card/domesticAndRelative/domesticandrelativedcfile';
import initRenewDomesticAndRelativeDC, { RenewDomesticAndRelativeDC } from './card/domesticAndRelative/renewdomesticandrelativedc';
import initOtherDependantDC, { OtherDependantDC } from './card/otherDependant/otherdependantdc';
import initOtherDependantDCFile, { OtherDependantDCFile } from './card/otherDependant/otherdependantdcfile';
import initRenewOtherDependantDC, { RenewOtherDependantDC } from './card/otherDependant/renewotherdependantdc';
import initOtherDependantDuplicataDC, { OtherDependantDuplicataDC } from './card/otherDependant/otherdependantduplicatadc';
import initOtherStaffDC, { OtherStaffDC } from './card/otherStaff/otherstaffdc';
import initOtherStaffDCFile, { OtherStaffDCFile } from './card/otherStaff/otherstaffdcfile';
import initRenewOtherStaffDC, { RenewOtherStaffDC } from './card/otherStaff/renewotherstaffdc';
import initOtherStaffDuplicataDC, { OtherStaffDuplicataDC } from './card/otherStaff/otherstaffduplicatadc';
import initSystemSettings, { SystemSettings } from './systemsettings';



dotenvConfig(); // Charger les variables d'environnement

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env as keyof typeof dbConfig] as {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: Dialect;
  use_env_variable?: string;
};

// Interface typée pour la base de données avec tous les modèles
interface IDB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;

  // Core models
  User: ModelStatic<User>;
  Institution: ModelStatic<Institution>;
  AccessGroup: ModelStatic<AccessGroup>;
  Plaque: ModelStatic<Plaque>;
  RefreshToken: ModelStatic<RefreshToken>;
  CardType: ModelStatic<CardType>;

  // Owner models
  OwnerDiplomaticCard: ModelStatic<OwnerDiplomaticCard>;
  OwnerDiplomaticCardFile: ModelStatic<OwnerDiplomaticCardFile>;
  RenewOwnerDC: ModelStatic<RenewOwnerDC>;
  OwnerDuplicataDC: ModelStatic<OwnerDuplicataDC>;

  // Child models
  ChildDC: ModelStatic<ChildDC>;
  ChildDCFile: ModelStatic<ChildDCFile>;
  RenewChildDC: ModelStatic<RenewChildDC>;
  ChildDuplicataDC: ModelStatic<ChildDuplicataDC>;

  // Spouse models
  SpouseDC: ModelStatic<SpouseDC>;
  SpouseDCFile: ModelStatic<SpouseDCFile>;
  RenewSpouseDC: ModelStatic<RenewSpouseDC>;
  SpouseDuplicataDC: ModelStatic<SpouseDuplicataDC>;

  // OtherDependant models
  OtherDependantDC: ModelStatic<OtherDependantDC>;
  OtherDependantDCFile: ModelStatic<OtherDependantDCFile>;
  RenewOtherDependantDC: ModelStatic<RenewOtherDependantDC>;
  OtherDependantDuplicataDC: ModelStatic<OtherDependantDuplicataDC>;

  // OtherStaff models
  OtherStaffDC: ModelStatic<OtherStaffDC>;
  OtherStaffDCFile: ModelStatic<OtherStaffDCFile>;
  RenewOtherStaffDC: ModelStatic<RenewOtherStaffDC>;
  OtherStaffDuplicataDC: ModelStatic<OtherStaffDuplicataDC>;

  // DomesticAndRelative models
  DomesticAndRelativeDC: ModelStatic<DomesticAndRelativeDC>;
  DomesticAndRelativeDCFile: ModelStatic<DomesticAndRelativeDCFile>;
  RenewDomesticAndRelativeDC: ModelStatic<RenewDomesticAndRelativeDC>;
  DomesticAndRelativeDuplicataDC: ModelStatic<DomesticAndRelativeDuplicataDC>;

  // System Settings
  SystemSettings: ModelStatic<SystemSettings>;
}

const db: IDB = {} as IDB;

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable] as string, config)
  : new Sequelize(config.database, config.username, config.password, config);


db.sequelize = sequelize;
db.Sequelize = Sequelize;


/* Export individual models for direct imports */

// Core models
db.User = initUser(sequelize);
db.AccessGroup = initAccessGroup(sequelize);
db.Institution = initInstitution(sequelize);
db.CardType = initCardType(sequelize);
db.Plaque = initPlaque(sequelize);
db.RefreshToken = initRefreshToken(sequelize);

// Owner models
db.OwnerDiplomaticCard = initOwnerDiplomaticCard(sequelize);
db.OwnerDiplomaticCardFile = initOwnerDiplomaticCardFile(sequelize);
db.RenewOwnerDC = initRenewOwnerDC(sequelize);
db.OwnerDuplicataDC = initOwnerDuplicataDC(sequelize);

// Child models
db.ChildDC = initChildDC(sequelize);
db.ChildDCFile = initChildDCFile(sequelize);
db.RenewChildDC = initRenewChildDC(sequelize);
db.ChildDuplicataDC = initChildDuplicataDC(sequelize);

// Spouse models
db.SpouseDC = initSpouseDC(sequelize);
db.SpouseDCFile = initSpouseDCFile(sequelize);
db.RenewSpouseDC = initRenewSpouseDC(sequelize);
db.SpouseDuplicataDC = initSpouseDuplicataDC(sequelize);


// OtherDependant models
db.OtherDependantDC = initOtherDependantDC(sequelize);
db.OtherDependantDCFile = initOtherDependantDCFile(sequelize);
db.RenewOtherDependantDC = initRenewOtherDependantDC(sequelize);
db.OtherDependantDuplicataDC = initOtherDependantDuplicataDC(sequelize);

// OtherStaff models
db.OtherStaffDC = initOtherStaffDC(sequelize);
db.OtherStaffDCFile = initOtherStaffDCFile(sequelize);
db.RenewOtherStaffDC = initRenewOtherStaffDC(sequelize);
db.OtherStaffDuplicataDC = initOtherStaffDuplicataDC(sequelize);

// DomesticAndRelative models
db.DomesticAndRelativeDC = initDomesticAndRelativeDC(sequelize);
db.DomesticAndRelativeDCFile = initDomesticAndRelativeDCFile(sequelize);
db.RenewDomesticAndRelativeDC = initRenewDomesticAndRelativeDC(sequelize);
db.DomesticAndRelativeDuplicataDC = initDomesticAndRelativeDuplicataDC(sequelize);

// System Settings
db.SystemSettings = initSystemSettings(sequelize);

// Appel des associations (IMPORTANT)
Object.values(db).forEach((model: any) => {
  if (model && model?.associate && typeof model.associate === "function") {
    model.associate(db);
  }
});


// Export the entire db object for use in the application
export default db;


// Export direct des classes typées pour une utilisation plus facile des modèles en typescript
export {
  User,
  AccessGroup,
  Institution,
  CardType,
  Plaque,
  RefreshToken,
  SystemSettings,
  OwnerDiplomaticCard,
  OwnerDiplomaticCardFile,
  RenewOwnerDC,
  OwnerDuplicataDC,
  ChildDC,
  ChildDCFile,
  RenewChildDC,
  ChildDuplicataDC,
  SpouseDC,
  SpouseDCFile,
  RenewSpouseDC,
  SpouseDuplicataDC,
  DomesticAndRelativeDC,
  DomesticAndRelativeDCFile,
  RenewDomesticAndRelativeDC,
  DomesticAndRelativeDuplicataDC,
  OtherDependantDC,
  OtherDependantDCFile,
  RenewOtherDependantDC,
  OtherDependantDuplicataDC,
  OtherStaffDC,
  OtherStaffDCFile,
  RenewOtherStaffDC,
  OtherStaffDuplicataDC
};
