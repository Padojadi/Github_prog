/*
  # Fix Bookings RLS JWT Path

  ## Overview
  Fix the JWT path in bookings RLS policies to correctly access user_role from app_metadata.

  ## Problem
  The current policies use `auth.jwt()->>'user_role'` which looks for user_role at the root of the JWT.
  However, Supabase stores custom app metadata in `app_metadata` object within the JWT.

  ## Solution
  Update policies to use the correct JWT path: `auth.jwt()->'app_metadata'->>'user_role'`

  ## Changes
  - Drop existing staff policies for bookings
  - Create new policies with correct JWT path
*/

-- Drop old staff policies
DROP POLICY IF EXISTS "Staff can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Staff can update all bookings" ON bookings;

-- Create new policy for staff to view all bookings
CREATE POLICY "Staff can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'agent', 'manager')
  );

-- Create new policy for staff to update all bookings
CREATE POLICY "Staff can update all bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'agent', 'manager')
  )
  WITH CHECK (
    auth.uid() = user_id
    OR COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') IN ('admin', 'agent', 'manager')
  );
