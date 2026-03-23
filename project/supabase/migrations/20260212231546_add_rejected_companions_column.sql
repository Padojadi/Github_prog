/*
  # Ajouter colonne pour accompagnants refusés
  
  1. Modifications
    - Ajouter la colonne `rejected_companions` à la table `access_requests`
    - Type JSONB pour stocker la liste des accompagnants refusés
    - Permet de garder une trace des accompagnants non approuvés
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'access_requests' AND column_name = 'rejected_companions'
  ) THEN
    ALTER TABLE access_requests ADD COLUMN rejected_companions jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;
