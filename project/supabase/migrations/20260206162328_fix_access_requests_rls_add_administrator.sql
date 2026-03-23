/*
  # Fix Access Requests RLS - Add Administrator Role

  ## Overview
  Corriger les politiques RLS de la table access_requests pour inclure le rôle 'administrator'.

  ## Problem
  Les politiques actuelles vérifient les rôles ('admin', 'manager', 'agent') mais le système utilise 'administrator' pour les administrateurs, pas 'admin'. 
  Cela empêche les administrateurs de voir et gérer les demandes d'accès.

  ## Solution
  Mettre à jour les politiques pour inclure 'administrator' en plus des autres rôles staff.

  ## Changes
  1. Drop existing staff policies
  2. Recreate policies with correct role names: 'administrator', 'lounge_manager', 'receptionist', 'agent'
  
  ## Security
  - Users can still view and create their own requests
  - Staff members (administrator, lounge_manager, receptionist, agent) can view and manage ALL requests
*/

-- Drop existing staff policies
DROP POLICY IF EXISTS "Staff can view all access requests" ON access_requests;
DROP POLICY IF EXISTS "Staff can update access requests" ON access_requests;

-- Recreate with correct role names including 'administrator'
CREATE POLICY "Staff can view all access requests"
  ON access_requests FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('administrator', 'lounge_manager', 'receptionist', 'agent')
  );

CREATE POLICY "Staff can update access requests"
  ON access_requests FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('administrator', 'lounge_manager', 'receptionist', 'agent')
  )
  WITH CHECK (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('administrator', 'lounge_manager', 'receptionist', 'agent')
  );
