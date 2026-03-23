/*
  # Create Lounges Table

  ## Overview
  This migration creates the lounges table to store VIP lounge information including capacity, amenities, pricing, and status.

  ## Tables Created
  - `lounges`
    - `id` (uuid, primary key)
    - `name` (text, unique, not null)
    - `description` (text)
    - `capacity` (integer, not null, must be positive)
    - `amenities` (jsonb, array of amenity objects)
    - `hourly_rate` (decimal, not null, must be positive)
    - `image_url` (text, optional)
    - `status` (text, default 'active', check constraint)
    - `location` (text, not null)
    - `created_at` (timestamptz, default now())
    - `updated_at` (timestamptz, default now())

  ## Security
  - Enable RLS on lounges table
  - Everyone (including public) can read active lounges
  - Admins and staff can create/update/delete lounges
  - All authenticated users can view all lounges (including inactive)
*/

-- Create lounges table
CREATE TABLE IF NOT EXISTS lounges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  capacity integer NOT NULL CHECK (capacity > 0),
  amenities jsonb DEFAULT '[]'::jsonb,
  hourly_rate decimal(10,2) NOT NULL CHECK (hourly_rate > 0),
  image_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  location text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_lounges_status ON lounges(status);
CREATE INDEX IF NOT EXISTS idx_lounges_name ON lounges(name);

-- Enable RLS
ALTER TABLE lounges ENABLE ROW LEVEL SECURITY;

-- Public can view active lounges
CREATE POLICY "Anyone can view active lounges"
  ON lounges FOR SELECT
  USING (status = 'active');

-- Authenticated users can view all lounges
CREATE POLICY "Authenticated users can view all lounges"
  ON lounges FOR SELECT
  TO authenticated
  USING (true);

-- Admins and staff can insert lounges
CREATE POLICY "Admins and staff can insert lounges"
  ON lounges FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Admins and staff can update lounges
CREATE POLICY "Admins and staff can update lounges"
  ON lounges FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Admins can delete lounges
CREATE POLICY "Admins can delete lounges"
  ON lounges FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create trigger for lounges table
CREATE TRIGGER update_lounges_updated_at
  BEFORE UPDATE ON lounges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();