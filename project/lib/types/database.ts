export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'applicant' | 'protocol_officer' | 'lounge_manager' | 'security' | 'administrator' | 'admin' | 'staff' | 'guest'
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'applicant' | 'protocol_officer' | 'lounge_manager' | 'security' | 'administrator' | 'admin' | 'staff' | 'guest'
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'applicant' | 'protocol_officer' | 'lounge_manager' | 'security' | 'administrator' | 'admin' | 'staff' | 'guest'
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lounges: {
        Row: {
          id: string
          name: string
          description: string | null
          capacity: number
          amenities: Json
          hourly_rate: number
          image_url: string | null
          status: 'active' | 'maintenance' | 'inactive'
          location: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          capacity: number
          amenities?: Json
          hourly_rate: number
          image_url?: string | null
          status?: 'active' | 'maintenance' | 'inactive'
          location: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          capacity?: number
          amenities?: Json
          hourly_rate?: number
          image_url?: string | null
          status?: 'active' | 'maintenance' | 'inactive'
          location?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          lounge_id: string | null
          user_id: string
          start_time: string
          end_time: string
          num_guests: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_amount: number
          special_requests: string | null
          admin_notes: string | null
          processed_by: string | null
          processed_at: string | null
          payment_method: 'online' | 'on_site'
          payment_status: 'pending' | 'completed' | 'failed'
          qr_code_data: string | null
          guest_first_name: string | null
          guest_last_name: string | null
          guest_function: string | null
          guest_phone: string | null
          guest_organization: string | null
          guest_nationality: string | null
          airline: string | null
          flight_number: string | null
          flight_origin: string | null
          flight_arrival_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lounge_id?: string | null
          user_id: string
          start_time: string
          end_time: string
          num_guests: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_amount: number
          special_requests?: string | null
          admin_notes?: string | null
          processed_by?: string | null
          processed_at?: string | null
          payment_method?: 'online' | 'on_site'
          payment_status?: 'pending' | 'completed' | 'failed'
          qr_code_data?: string | null
          guest_first_name?: string | null
          guest_last_name?: string | null
          guest_function?: string | null
          guest_phone?: string | null
          guest_organization?: string | null
          guest_nationality?: string | null
          airline?: string | null
          flight_number?: string | null
          flight_origin?: string | null
          flight_arrival_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lounge_id?: string | null
          user_id?: string
          start_time?: string
          end_time?: string
          num_guests?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_amount?: number
          special_requests?: string | null
          admin_notes?: string | null
          processed_by?: string | null
          processed_at?: string | null
          payment_method?: 'online' | 'on_site'
          payment_status?: 'pending' | 'completed' | 'failed'
          qr_code_data?: string | null
          guest_first_name?: string | null
          guest_last_name?: string | null
          guest_function?: string | null
          guest_phone?: string | null
          guest_organization?: string | null
          guest_nationality?: string | null
          airline?: string | null
          flight_number?: string | null
          flight_origin?: string | null
          flight_arrival_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      amenities: {
        Row: {
          id: string
          name: string
          icon: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          description?: string | null
          created_at?: string
        }
      }
      booking_history: {
        Row: {
          id: string
          booking_id: string
          action: string
          old_status: string | null
          new_status: string | null
          notes: string | null
          processed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          action: string
          old_status?: string | null
          new_status?: string | null
          notes?: string | null
          processed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          action?: string
          old_status?: string | null
          new_status?: string | null
          notes?: string | null
          processed_by?: string | null
          created_at?: string
        }
      }
    }
    Functions: {
      check_lounge_availability: {
        Args: {
          p_lounge_id: string
          p_start_time: string
          p_end_time: string
          p_booking_id?: string
        }
        Returns: boolean
      }
    }
  }
}
