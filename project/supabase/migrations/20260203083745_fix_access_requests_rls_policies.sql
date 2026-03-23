/*
  # Fix Access Requests RLS Policies

  ## Overview
  Corriger les politiques RLS de la table access_requests pour permettre au staff de voir et gérer toutes les demandes d'accès.

  ## Problème
  Les politiques actuelles utilisent un mauvais chemin JWT qui empêche le staff de voir les demandes.
  Ancien chemin: (auth.jwt()->>'app_metadata')::jsonb->>'user_role'
  Nouveau chemin: auth.jwt()->'app_metadata'->>'user_role'

  ## Solution
  1. Supprimer les anciennes politiques
  2. Créer de nouvelles politiques avec le bon chemin JWT
  3. Utiliser COALESCE pour gérer les cas où le rôle n'existe pas

  ## Changements
  - Users can view own access requests: Permet aux utilisateurs de voir leurs propres demandes
  - Staff can view all access requests: Permet au staff (admin, manager, agent) de voir TOUTES les demandes
  - Staff can update access requests: Permet au staff de mettre à jour les demandes
  - Users can create own access requests: Permet aux utilisateurs de créer des demandes
*/

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view own access requests" ON access_requests;
DROP POLICY IF EXISTS "Staff can view all access requests" ON access_requests;
DROP POLICY IF EXISTS "Staff can update access requests" ON access_requests;
DROP POLICY IF EXISTS "Users can create own access requests" ON access_requests;

-- Politique pour que les utilisateurs voient leurs propres demandes
CREATE POLICY "Users can view own access requests"
  ON access_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Politique pour que le staff voit TOUTES les demandes
CREATE POLICY "Staff can view all access requests"
  ON access_requests FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'manager', 'agent')
  );

-- Politique pour que le staff puisse mettre à jour les demandes
CREATE POLICY "Staff can update access requests"
  ON access_requests FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'manager', 'agent')
  )
  WITH CHECK (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'manager', 'agent')
  );

-- Politique pour que les utilisateurs puissent créer leurs propres demandes
CREATE POLICY "Users can create own access requests"
  ON access_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);