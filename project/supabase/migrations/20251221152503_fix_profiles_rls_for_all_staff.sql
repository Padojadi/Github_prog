/*
  # Fix Profiles RLS Policies for All Staff

  ## Overview
  Update profiles RLS policies to allow all staff members (admin, agent, manager) to view and update profiles.
  Also fix the JWT path to use 'user_role' instead of 'app_metadata' -> 'role'.

  ## Changes

  ### 1. Drop Old Staff Policies
    - Remove policies that only allow administrators

  ### 2. Create New Staff Policies
    - Staff can view all profiles (admin, agent, manager)
    - Staff can update all profiles (admin, agent, manager)
    - Use correct JWT path: auth.jwt()->>'user_role'

  ## Security
    - Users can still only view/update their own profile
    - All staff roles (admin, agent, manager) can view/update all profiles
    - Prevents errors when staff try to view user profiles in bookings
*/

-- Drop old staff-only policies
DROP POLICY IF EXISTS "Administrators can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Administrators can update all profiles" ON profiles;

-- Staff can view all profiles
CREATE POLICY "Staff can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR (auth.jwt()->>'user_role')::text IN ('admin', 'agent', 'manager')
  );

-- Staff can update all profiles
CREATE POLICY "Staff can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    OR (auth.jwt()->>'user_role')::text IN ('admin', 'agent', 'manager')
  )
  WITH CHECK (
    auth.uid() = id
    OR (auth.jwt()->>'user_role')::text IN ('admin', 'agent', 'manager')
  );
