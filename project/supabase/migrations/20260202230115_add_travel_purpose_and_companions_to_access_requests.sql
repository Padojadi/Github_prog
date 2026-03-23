/*
  # Add travel purpose and companions to access requests

  1. Changes
    - Add `travel_purpose` (text) - Motif du voyage
    - Add `companion_type` (text) - Type d'accompagnant: Famille, Délégation, Autres
    - Add `family_relation` (text) - Relation familiale si companion_type = Famille
    - Add `delegation_members` (jsonb) - Liste des membres de délégation si companion_type = Délégation
  
  2. Notes
    - All new fields are optional
    - delegation_members will store an array of objects with fields: nom, prenom, fonction, numero_passeport, type_passeport
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_requests' AND column_name = 'travel_purpose'
  ) THEN
    ALTER TABLE access_requests ADD COLUMN travel_purpose text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_requests' AND column_name = 'companion_type'
  ) THEN
    ALTER TABLE access_requests ADD COLUMN companion_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_requests' AND column_name = 'family_relation'
  ) THEN
    ALTER TABLE access_requests ADD COLUMN family_relation text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_requests' AND column_name = 'delegation_members'
  ) THEN
    ALTER TABLE access_requests ADD COLUMN delegation_members jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;