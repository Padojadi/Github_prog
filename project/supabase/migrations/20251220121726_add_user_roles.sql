/*
  # Ajout des rôles utilisateurs
  
  1. Nouveaux Types
    - `user_role` enum avec les valeurs:
      - `applicant`: Demandeur (Ambassade, ministère, entreprise, représentant)
      - `protocol_officer`: Agent de protocole (Vérifie la conformité des demandes)
      - `lounge_manager`: Gestionnaire de salon (Planifie la réception et les ressources)
      - `security`: Sécurité (Contrôle d'accès, enregistrement entrées/sorties)
      - `administrator`: Administrateur (Supervision globale, gestion des utilisateurs, paramètres)
  
  2. Modifications
    - Ajout de la colonne `role` à la table `profiles`
    - Par défaut, les utilisateurs ont le rôle `applicant`
  
  3. Sécurité
    - Seuls les administrateurs peuvent modifier les rôles
    - Les utilisateurs peuvent voir leur propre rôle
*/

-- Créer l'enum pour les rôles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM (
      'applicant',
      'protocol_officer',
      'lounge_manager',
      'security',
      'administrator'
    );
  END IF;
END $$;

-- Ajouter la colonne role à la table profiles si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'applicant' NOT NULL;
  END IF;
END $$;

-- Créer un index sur la colonne role pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Créer une politique RLS pour permettre aux administrateurs de gérer tous les profils
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Administrators can manage all profiles'
  ) THEN
    CREATE POLICY "Administrators can manage all profiles"
      ON profiles
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'administrator'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'administrator'
        )
      );
  END IF;
END $$;
