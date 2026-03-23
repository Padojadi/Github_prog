/*
  # Fix RLS Policies for Staff Roles

  1. Problem
    - Current RLS policies check for 'admin', 'manager', 'agent' roles
    - Actual roles in database are 'administrator', 'protocol_officer', 'lounge_manager', 'security', 'admin', 'staff', 'guest', 'applicant'
    - This mismatch prevents staff from viewing profile and lounge data in JOIN queries

  2. Changes
    - Update profiles table policies to recognize correct staff roles
    - Update lounges table policies to recognize correct staff roles
    - Staff roles: 'administrator', 'protocol_officer', 'lounge_manager', 'security', 'admin', 'staff'

  3. Security
    - Maintains RLS security
    - Only allows staff members to view all profiles and lounges
    - Regular users can only see their own profile
*/

-- Drop existing conflicting policies for profiles
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Staff can update all profiles" ON profiles;

-- Create new policy for staff to view all profiles
CREATE POLICY "Staff can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') = ANY (
      ARRAY['administrator', 'protocol_officer', 'lounge_manager', 'security', 'admin', 'staff']
    )
  );

-- Create new policy for staff to update all profiles
CREATE POLICY "Staff can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id 
    OR 
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') = ANY (
      ARRAY['administrator', 'protocol_officer', 'lounge_manager', 'security', 'admin', 'staff']
    )
  )
  WITH CHECK (
    auth.uid() = id 
    OR 
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') = ANY (
      ARRAY['administrator', 'protocol_officer', 'lounge_manager', 'security', 'admin', 'staff']
    )
  );

-- Drop existing policies for lounges
DROP POLICY IF EXISTS "Public can view active lounges" ON lounges;
DROP POLICY IF EXISTS "Staff can manage lounges" ON lounges;

-- Create new policy for viewing lounges (public can see active, staff can see all)
CREATE POLICY "Public can view active lounges"
  ON lounges FOR SELECT
  TO public
  USING (
    status = 'active' 
    OR 
    (
      auth.role() = 'authenticated' 
      AND 
      COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') = ANY (
        ARRAY['administrator', 'protocol_officer', 'lounge_manager', 'security', 'admin', 'staff']
      )
    )
  );

-- Create new policy for staff to manage all lounges
CREATE POLICY "Staff can manage lounges"
  ON lounges FOR ALL
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') = ANY (
      ARRAY['administrator', 'protocol_officer', 'lounge_manager', 'admin', 'staff']
    )
  )
  WITH CHECK (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') = ANY (
      ARRAY['administrator', 'protocol_officer', 'lounge_manager', 'admin', 'staff']
    )
  );