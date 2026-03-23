/*
  # Fix Profiles RLS JWT Path

  ## Overview
  Fix the JWT path in profiles RLS policies to correctly access user_role from app_metadata.

  ## Problem
  The current policies use `auth.jwt()->>'user_role'` which looks for user_role at the root of the JWT.
  However, Supabase stores custom app metadata in `app_metadata` object within the JWT.

  ## Solution
  Update policies to use the correct JWT path: `auth.jwt()->'app_metadata'->>'user_role'`

  ## Changes
  - Drop existing staff view and update policies
  - Create new policies with correct JWT path
*/

-- Drop old policies
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Staff can update all profiles" ON profiles;

-- Create new policy for staff to view all profiles
CREATE POLICY "Staff can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'agent', 'manager')
  );

-- Create new policy for staff to update all profiles
CREATE POLICY "Staff can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    OR COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'agent', 'manager')
  )
  WITH CHECK (
    auth.uid() = id
    OR COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'agent', 'manager')
  );
