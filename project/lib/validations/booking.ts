import { z } from 'zod'

export const bookingSchema = z.object({
  loungeId: z.string().uuid('Invalid lounge ID'),
  startTime: z.date(),
  endTime: z.date(),
  numGuests: z.number().min(1, 'At least 1 guest is required'),
  specialRequests: z.string().optional(),
}).refine((data) => data.endTime > data.startTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
})

export type BookingInput = z.infer<typeof bookingSchema>

const delegationMemberSchema = z.object({
  nom: z.string().min(2, 'Le nom est requis'),
  prenom: z.string().min(2, 'Le prénom est requis'),
  fonction: z.string().min(2, 'La fonction est requise'),
  numeroPasSeport: z.string().min(1, 'Le numéro de passeport est requis'),
  typePasSeport: z.string().min(1, 'Le type de passeport est requis'),
})

const familyMemberSchema = z.object({
  nom: z.string().min(2, 'Le nom est requis'),
  prenom: z.string().min(2, 'Le prénom est requis'),
  nationalite: z.string().min(2, 'La nationalité est requise'),
  numeroPasSeport: z.string().optional(),
  relation: z.string().optional(),
})

export const loungeAccessRequestSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  function: z.string().min(2, 'La fonction est requise'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  organization: z.string().min(2, 'L\'organisme est requis'),
  nationality: z.string().min(2, 'La nationalité est requise'),
  passportType: z.string().min(1, 'Le type de passeport est requis'),
  passportNumber: z.string().min(1, 'Le numéro de passeport est requis'),
  travelPurpose: z.string().optional(),
  companionType: z.enum(['Famille', 'Délégation', 'Autres', 'Aucun']).optional(),
  familyRelation: z.string().optional(),
  familyMembers: z.array(familyMemberSchema).optional(),
  delegationMembers: z.array(delegationMemberSchema).optional(),
  airline: z.string().optional(),
  flightNumber: z.string().optional(),
  flightOrigin: z.string().optional(),
  flightArrivalTime: z.date().optional(),
  startTime: z.date(),
  endTime: z.date(),
  specialRequests: z.string().optional(),
}).refine((data) => data.endTime > data.startTime, {
  message: 'L\'heure de fin doit être après l\'heure de début',
  path: ['endTime'],
})

export type LoungeAccessRequestInput = z.infer<typeof loungeAccessRequestSchema>
export type DelegationMember = z.infer<typeof delegationMemberSchema>
export type FamilyMember = z.infer<typeof familyMemberSchema>
