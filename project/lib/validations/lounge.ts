import { z } from 'zod'

const timeSlotSchema = z.object({
  start: z.string(),
  end: z.string(),
})

export const loungeSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères').optional(),
  capacity: z.number().min(1, 'La capacité doit être au moins 1'),
  hourlyRate: z.number().min(0, 'Le tarif horaire doit être positif'),
  location: z.string().min(3, 'La localisation est requise'),
  status: z.enum(['active', 'maintenance', 'inactive']),
  amenities: z.array(z.string()).default([]),
  imageUrl: z.string().url('URL d\'image invalide').optional().or(z.literal('')),
  loungeType: z.string().min(1, 'Le type de salon est requis'),
  maxBookings: z.number().min(1, 'Le nombre maximum de réservations doit être au moins 1'),
  availableDays: z.array(z.string()).min(1, 'Sélectionnez au moins un jour disponible'),
  timeSlots: z.array(timeSlotSchema).min(1, 'Ajoutez au moins un créneau horaire'),
})

export type LoungeInput = z.infer<typeof loungeSchema>
