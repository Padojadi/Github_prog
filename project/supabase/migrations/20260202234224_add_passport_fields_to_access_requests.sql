/*
  # Add passport fields to access_requests table

  1. Changes
    - Add `passport_type` column to access_requests table
      - Type: text
      - Options: 'Ordinaire', 'Service/Officiel', 'Diplomatique'
    - Add `passport_number` column to access_requests table
      - Type: text

  2. Notes
    - These fields are optional as they weren't previously required
    - Allows capturing important identification information for access requests
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_requests' AND column_name = 'passport_type'
  ) THEN
    ALTER TABLE access_requests ADD COLUMN passport_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_requests' AND column_name = 'passport_number'
  ) THEN
    ALTER TABLE access_requests ADD COLUMN passport_number text;
  END IF;
END $$;
