/*
  # Create Amenities Reference Table

  ## Overview
  This migration creates the amenities reference table to store available amenity options for lounges.

  ## Tables Created
  - `amenities`
    - `id` (uuid, primary key)
    - `name` (text, unique, not null)
    - `icon` (text, lucide icon name)
    - `description` (text)
    - `created_at` (timestamptz, default now())

  ## Security
  - Enable RLS on amenities table
  - Everyone can read amenities
  - Only admins can create/update/delete amenities

  ## Initial Data
  - Seed common VIP lounge amenities
*/

-- Create amenities table
CREATE TABLE IF NOT EXISTS amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  icon text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;

-- Everyone can view amenities
CREATE POLICY "Anyone can view amenities"
  ON amenities FOR SELECT
  USING (true);

-- Admins can insert amenities
CREATE POLICY "Admins can insert amenities"
  ON amenities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update amenities
CREATE POLICY "Admins can update amenities"
  ON amenities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can delete amenities
CREATE POLICY "Admins can delete amenities"
  ON amenities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert common VIP lounge amenities
INSERT INTO amenities (name, icon, description) VALUES
  ('WiFi', 'Wifi', 'High-speed wireless internet access'),
  ('Refreshments', 'Coffee', 'Complimentary snacks and beverages'),
  ('Private Restroom', 'Bath', 'Exclusive bathroom facilities'),
  ('TV/Entertainment', 'Tv', 'Large screen television with streaming'),
  ('Conference Equipment', 'Presentation', 'Projector and video conferencing setup'),
  ('Sound System', 'Music', 'Premium audio system'),
  ('Climate Control', 'Thermometer', 'Individual temperature control'),
  ('Privacy Screens', 'Eye', 'Retractable privacy partitions'),
  ('Charging Stations', 'Battery', 'USB and wireless charging ports'),
  ('Comfortable Seating', 'Armchair', 'Luxury lounge chairs and sofas')
ON CONFLICT (name) DO NOTHING;