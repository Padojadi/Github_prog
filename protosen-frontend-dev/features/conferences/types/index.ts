import { Value } from "@udecode/plate";
import { JobTitle } from "../job-titles/types";
import { SupportCategory } from "../support-categories/types";

export type TConferenceStatus =
  | "ACCEPTED"
  | "PENDING"
  | "VALIDATED"
  | "CONFIRMED"
  | "REJECTED"
  | "REJECTED_PERMANENTLY"
  | "PUBLISHED";

export interface Conference {
  id: string;
  firstName: string;
  lastName: string;
  institutionId: string;
  job: string;
  email: string;
  themeDoc: string;
  budgetDoc: string;
  startDate: string;
  endDate: string;
  matriculeNumber: string;
  phone: string;
  title: string;
  location: string;
  description: Value;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  statusHistories: StatusHistory[];
  lastStatus: TConferenceStatus;
  _count: { participants: number };
}

export interface ConferencePublic {
  id: string;
  firstName: string;
  lastName: string;
  institutionId: string;
  job: string;
  email: string;
  themeDoc: string;
  budgetDoc: string;
  startDate: string;
  endDate: string;
  matriculeNumber: string;
  phone: string;
  title: string;
  location: string;
  description: Value;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  lastStatus: TConferenceStatus;
  tickets: ConferencePass[];
  conferenceAccommodations: ConferenceAccommodation[];
  _count: { participants: number };
}

export type ConferencePublicGetAll = Omit<
  ConferencePublic,
  "tickets" | "conferenceAccommodation"
>;

export type StatusHistoryChangedBy = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export interface StatusHistory {
  id: string;
  conferenceId: string;
  status: TConferenceStatus;
  changedByID: string;
  changedBy: StatusHistoryChangedBy;
  rejectionReason: string | null;
  changedAt: string;
}

export interface ConferencePass {
  id: string;
  name: string;
  conferenceId: string;
  description: string;
  colorTheme: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConferenceHotel {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  location: string;
  geolocation: string | null;
  reservationLink: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConferenceAccommodation {
  id: string;
  conferenceId: string;
  accommodationId: string;
  accommodation: ConferenceHotel;
}

export type TGender = "MALE" | "FEMALE";

export type TConferenceRegistrationStatus =
  | "PROCESSING"
  | "PENDING_PAYMENT"
  | "REJECTED"
  | "PAID"
  | "CANCELLED"
  | "REFUNDED";

export type TConferenceRegistrationTicket = {
  id: string;
  conferenceId: string;
  name: string;
  description: string;
  colorTheme: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type TConferenceRegistrationAccomodation = {
  id: string;
  conferenceId: string;
  accommodationId: string;
  accommodation: ConferenceHotel;
};

export interface RegistrationStatusHistory {
  id: string;
  participantId: string;
  status: TConferenceRegistrationStatus;
  changedByID: string;
  changedBy: StatusHistoryChangedBy;
  rejectionReason: string | null;
  changedAt: string;
}

export type ConferenceRegistration = {
  id: string;
  firstName: string;
  lastName: string;
  gender: TGender;
  organisation: string;
  postalCode: string;
  city: string;
  country: string;
  visaNeeded: boolean;
  acceptTerms: boolean;
  email: string;
  address: string;
  phone: string;
  functionId: string | null;
  customFunction: string | null;
  conferenceParticipantTypeId: string | null;
  customAccommodation: string | null;
  loginCode: string | null;
  avatarUrl: string | null;
  ticketId: string;
  conferenceId: string;
  subscriptionStatus: TConferenceRegistrationStatus;
  paymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
  conferenceAccomodationId: string | null;
  identityType: string;
  identityNumber: string;
  identityIssueDate: string;
  dateOfBirth: string;
  nationality: string;
  ticket: TConferenceRegistrationTicket;
  conferenceAccommodation: TConferenceRegistrationAccomodation | null;
  conference: ConferencePublic;
  conferenceParticipantType: ParticipantTypeAssigned | null;
  functionModel: JobTitle | null;
  supportOptions: { supportOption: SupportCategory }[];
  subscriptionStatusHistory: RegistrationStatusHistory[];
};

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  organisation: string;
  postalCode: string;
  code: string | null;
  city: string;
  country: string;
  visaNeeded: boolean;
  acceptTerms: boolean;
  email: string;
  address: string;
  phone: string;
  functionId: string | null;
  customFunction: string | null;
  conferenceParticipantTypeId: string | null;
  customAccommodation: string | null;
  loginCode: string | null;
  avatarUrl: string | null;
  ticketId: string;
  conferenceId: string;
  subscriptionStatus: TConferenceRegistrationStatus;
  paydunyatoken: string | null;
  createdAt: string;
  updatedAt: string;
  conferenceAccommodationId: string;
  identityType: string;
  identityNumber: string;
  identityIssueDate: string;
  dateOfBirth: string;
  nationality: string;
  ticket: ConferencePass;
  conference: ConferenceParticipant;
  conferenceParticipantType: ParticipantTypeAssigned | null;
  functionModel: JobTitle | null;
  supportOptions: { supportOption: SupportCategory }[];
  conferenceAccommodation: ConferenceAccommodation | null;
  subscriptionStatusHistory: RegistrationStatusHistory[];
}

export interface ConferenceParticipant {
  id: string;
  firstName: string;
  lastName: string;
  institutionId: string;
  job: string;
  email: string;
  themeDoc: string;
  budgetDoc: string;
  startDate: string;
  endDate: string;
  matriculeNumber: string;
  phone: string;
  title: string;
  location: string;
  description: Value;
  creatorId: string;
  lastStatus: string;
  createdAt: string;
  updatedAt: string;
  conferenceAccommodations: ConferenceAccommodation[];
}

export type ParticipantTokenData = {
  token: string;
  participantId: string;
  createdAt: number;
};

export type ParticipantTypeAssigned = {
  id: string;
  participantTypeId: string;
  label: string;
  description: string | null;
  requiresValidation: boolean;
  createdAt: string;
};
