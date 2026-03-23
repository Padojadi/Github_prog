import { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Lounge = Database['public']['Tables']['lounges']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Amenity = Database['public']['Tables']['amenities']['Row']

export type LoungeWithDetails = Lounge & {
  amenity_list?: Amenity[]
}

export type BookingWithDetails = Booking & {
  lounge?: Lounge
  profile?: Profile
}

export type UserRole = 'applicant' | 'protocol_officer' | 'lounge_manager' | 'security' | 'administrator'
export type LoungeStatus = 'active' | 'maintenance' | 'inactive'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
