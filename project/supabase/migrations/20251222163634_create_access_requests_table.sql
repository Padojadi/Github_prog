/*
  # Create access_requests table

  1. New Tables
    - `access_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `guest_first_name` (text)
      - `guest_last_name` (text)
      - `guest_function` (text)
      - `guest_phone` (text)
      - `guest_organization` (text)
      - `guest_nationality` (text)
      - `airline` (text, optional)
      - `flight_number` (text, optional)
      - `flight_origin` (text, optional)
      - `flight_arrival_time` (timestamptz, optional)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `num_guests` (integer)
      - `special_requests` (text, optional)
      - `status` (text: pending, approved, rejected)
      - `admin_notes` (text, optional)
      - `processed_by` (uuid, optional, foreign key to profiles)
      - `processed_at` (timestamptz, optional)
      - `booking_id` (uuid, optional, foreign key to bookings - set when approved)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `access_requests` table
    - Add policy for users to create their own access requests
    - Add policy for users to view their own access requests
    - Add policy for staff to view all access requests
    - Add policy for staff to update access requests

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on status for filtering pending requests
*/

CREATE TABLE IF NOT EXISTS access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guest_first_name text NOT NULL,
  guest_last_name text NOT NULL,
  guest_function text NOT NULL,
  guest_phone text NOT NULL,
  guest_organization text NOT NULL,
  guest_nationality text NOT NULL,
  airline text,
  flight_number text,
  flight_origin text,
  flight_arrival_time timestamptz,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  num_guests integer NOT NULL DEFAULT 1,
  special_requests text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  processed_by uuid REFERENCES profiles(id),
  processed_at timestamptz,
  booking_id uuid REFERENCES bookings(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create own access requests"
  ON access_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own access requests"
  ON access_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all access requests"
  ON access_requests FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'app_metadata')::jsonb->>'user_role' IN ('admin', 'staff')
  );

CREATE POLICY "Staff can update access requests"
  ON access_requests FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'app_metadata')::jsonb->>'user_role' IN ('admin', 'staff')
  )
  WITH CHECK (
    (auth.jwt()->>'app_metadata')::jsonb->>'user_role' IN ('admin', 'staff')
  );

CREATE INDEX IF NOT EXISTS idx_access_requests_user_id ON access_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_requests_created_at ON access_requests(created_at DESC);