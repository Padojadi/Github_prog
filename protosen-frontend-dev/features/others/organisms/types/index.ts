export type Organism = {
  id: string;
  institutionType: TInstitutionType;
  code: string;
  libelle: string;
  service: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deliverThe: string;
  dateOfBirth: string;
  travellingTitleValidUntil: string;
  dateTakingOffice: string;
  dateArrivalSenegal: string;
  dateEndOfMission: string;
  lastestWorkDate: string;
};

export type TInstitutionType =
  | "AMBASSADE"
  | "CONSULAT"
  | "ORGANISATION INTERNATIONALE"
  | "FONDATIONS ET ONG"
  | "BANQUE OU INSTITUTION FINANCIÈRE"
  | "ORGANISATION AFRICAINE"
  | "SYSTEME DES NATIONS UNIES (SNU)";
