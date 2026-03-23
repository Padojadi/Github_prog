/*
  # Add Booking Notes and Decision History

  ## Overview
  Add support for admin notes, decision tracking, and booking history to enable
  protocol agents to document their decisions and maintain an audit trail.

  ## Changes

  ### 1. New Columns in `bookings` Table
    - `admin_notes` (text, nullable): Notes added by the agent when approving/rejecting
    - `processed_by` (uuid, foreign key): References the agent who processed the request
    - `processed_at` (timestamptz, nullable): Timestamp when the request was processed

  ### 2. New Table: `booking_history`
    - `id` (uuid, primary key): Unique identifier
    - `booking_id` (uuid, foreign key): References the booking
    - `action` (text): The action taken (approved, rejected, modified)
    - `old_status` (text): Previous status
    - `new_status` (text): New status
    - `notes` (text, nullable): Notes from the agent
    - `processed_by` (uuid, foreign key): Agent who took the action
    - `created_at` (timestamptz): When the action was taken

  ## Security
    - Enable RLS on `booking_history` table
    - Admins and agents can view all history
    - Users can view history for their own bookings
*/

-- Add new columns to bookings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE bookings ADD COLUMN admin_notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'processed_by'
  ) THEN
    ALTER TABLE bookings ADD COLUMN processed_by uuid REFERENCES profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'processed_at'
  ) THEN
    ALTER TABLE bookings ADD COLUMN processed_at timestamptz;
  END IF;
END $$;

-- Create booking_history table
CREATE TABLE IF NOT EXISTS booking_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  action text NOT NULL,
  old_status text,
  new_status text,
  notes text,
  processed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE booking_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for booking_history

-- Admins and agents can view all history
CREATE POLICY "Admins and agents can view all booking history"
  ON booking_history FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'user_role')::text IN ('admin', 'agent')
  );

-- Users can view history for their own bookings
CREATE POLICY "Users can view their own booking history"
  ON booking_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_history.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Only admins and agents can insert history
CREATE POLICY "Admins and agents can insert booking history"
  ON booking_history FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt()->>'user_role')::text IN ('admin', 'agent')
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_booking_history_booking_id ON booking_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_history_created_at ON booking_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_processed_at ON bookings(processed_at);
