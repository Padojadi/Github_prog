/*
  # Add Guest and Flight Information to Bookings

  1. New Fields
    - `guest_first_name` - Guest's first name
    - `guest_last_name` - Guest's last name
    - `guest_function` - Guest's job function/title
    - `guest_phone` - Guest's phone number
    - `guest_organization` - Guest's organization/company
    - `guest_nationality` - Guest's nationality
    - `airline` - Airline name
    - `flight_number` - Flight number
    - `flight_origin` - Origin airport/city
    - `flight_arrival_time` - Scheduled arrival time

  2. Changes
    - Add new columns to bookings table for guest and flight information
    - Make lounge_id optional (NULL) to support requests without specific lounge
    - Keep existing fields for backward compatibility

  3. Notes
    - These fields support the new "Lounge Access Request" flow
    - Guest information can override profile information
    - Flight information is optional but recommended
*/

-- Add guest information fields
ALTER TABLE bookings 
  ADD COLUMN IF NOT EXISTS guest_first_name text,
  ADD COLUMN IF NOT EXISTS guest_last_name text,
  ADD COLUMN IF NOT EXISTS guest_function text,
  ADD COLUMN IF NOT EXISTS guest_phone text,
  ADD COLUMN IF NOT EXISTS guest_organization text,
  ADD COLUMN IF NOT EXISTS guest_nationality text;

-- Add flight information fields
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS airline text,
  ADD COLUMN IF NOT EXISTS flight_number text,
  ADD COLUMN IF NOT EXISTS flight_origin text,
  ADD COLUMN IF NOT EXISTS flight_arrival_time timestamptz;

-- Make lounge_id nullable to support general access requests
ALTER TABLE bookings
  ALTER COLUMN lounge_id DROP NOT NULL;

-- Add a check to ensure either lounge_id is provided or it's a general request
ALTER TABLE bookings
  ADD CONSTRAINT check_lounge_or_general_request 
  CHECK (lounge_id IS NOT NULL OR status = 'pending');