/*
  # Fix All RLS JWT Paths

  ## Overview
  Fix the JWT path in all RLS policies to correctly access user_role from app_metadata.
  Also remove circular dependencies where policies query the profiles table.

  ## Problem
  1. Some policies use `auth.jwt()->>'user_role'` which looks for user_role at the root
  2. Some policies query the profiles table which creates circular dependencies
  
  ## Solution
  Update all policies to use: `auth.jwt()->'app_metadata'->>'user_role'`

  ## Changes
  - booking_history: Fix INSERT and SELECT policies
  - lounges: Fix ALL and SELECT policies to not depend on profiles table
  - amenities: Fix ALL policy to not depend on profiles table
*/

-- Fix booking_history policies
DROP POLICY IF EXISTS "Admins and agents can view all booking history" ON booking_history;
DROP POLICY IF EXISTS "Admins and agents can insert booking history" ON booking_history;

CREATE POLICY "Admins and agents can view all booking history"
  ON booking_history FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'agent', 'manager')
  );

CREATE POLICY "Admins and agents can insert booking history"
  ON booking_history FOR INSERT
  TO authenticated
  WITH CHECK (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'agent', 'manager')
  );

-- Fix lounges policies
DROP POLICY IF EXISTS "Staff can manage lounges" ON lounges;
DROP POLICY IF EXISTS "Public can view active lounges" ON lounges;

CREATE POLICY "Staff can manage lounges"
  ON lounges FOR ALL
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'manager')
  )
  WITH CHECK (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'manager')
  );

CREATE POLICY "Public can view active lounges"
  ON lounges FOR SELECT
  USING (
    status = 'active'
    OR (
      auth.role() = 'authenticated'
      AND COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'manager', 'agent')
    )
  );

-- Fix amenities policy
DROP POLICY IF EXISTS "Admins can manage amenities" ON amenities;

CREATE POLICY "Admins can manage amenities"
  ON amenities FOR ALL
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin')
  )
  WITH CHECK (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin')
  );
