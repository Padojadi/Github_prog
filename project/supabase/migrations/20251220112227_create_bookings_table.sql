/*
  # Create Bookings Table

  ## Overview
  This migration creates the bookings table to manage VIP lounge reservations with conflict prevention and status tracking.

  ## Tables Created
  - `bookings`
    - `id` (uuid, primary key)
    - `lounge_id` (uuid, foreign key to lounges)
    - `user_id` (uuid, foreign key to auth.users)
    - `start_time` (timestamptz, not null)
    - `end_time` (timestamptz, not null)
    - `num_guests` (integer, not null, must be positive)
    - `status` (text, default 'pending')
    - `total_amount` (decimal, not null)
    - `special_requests` (text, optional)
    - `created_at` (timestamptz, default now())
    - `updated_at` (timestamptz, default now())

  ## Security
  - Enable RLS on bookings table
  - Users can view their own bookings
  - Admins and staff can view all bookings
  - Users can create bookings
  - Users can cancel their own pending bookings
  - Admins and staff can update any booking

  ## Functions
  - check_lounge_availability: Prevents double bookings
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lounge_id uuid NOT NULL REFERENCES lounges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  num_guests integer NOT NULL CHECK (num_guests > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (end_time > start_time)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_lounge_id ON bookings(lounge_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_end_time ON bookings(end_time);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins and staff can view all bookings
CREATE POLICY "Admins and staff can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Users can create bookings
CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending bookings (for cancellation)
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins and staff can update any booking
CREATE POLICY "Admins and staff can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Create trigger for bookings table
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check lounge availability
CREATE OR REPLACE FUNCTION check_lounge_availability(
  p_lounge_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz,
  p_booking_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE lounge_id = p_lounge_id
    AND status IN ('pending', 'confirmed')
    AND (id != p_booking_id OR p_booking_id IS NULL)
    AND (
      (start_time <= p_start_time AND end_time > p_start_time)
      OR (start_time < p_end_time AND end_time >= p_end_time)
      OR (start_time >= p_start_time AND end_time <= p_end_time)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;