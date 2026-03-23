/*
  # Complete Role Migration
  
  1. Changes
    - Drop ALL existing RLS policies on all tables
    - Update role column from text with CHECK constraint to user_role enum
    - Update existing data to use new role values
    - Recreate all RLS policies with correct role values
  
  2. Security
    - Maintains comprehensive RLS across all tables
    - Updates all role references to use new enum values
*/

-- Drop ALL existing policies on ALL tables
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Administrators can manage all profiles" ON profiles;

DROP POLICY IF EXISTS "Public can view active lounges" ON lounges;
DROP POLICY IF EXISTS "Staff can manage lounges" ON lounges;

DROP POLICY IF EXISTS "Users can view bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update bookings" ON bookings;

DROP POLICY IF EXISTS "Anyone can view amenities" ON amenities;
DROP POLICY IF EXISTS "Admins can manage amenities" ON amenities;

-- Remove old CHECK constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Update existing role values to match new enum
UPDATE profiles SET role = 'applicant' WHERE role = 'guest';
UPDATE profiles SET role = 'administrator' WHERE role = 'admin';
UPDATE profiles SET role = 'lounge_manager' WHERE role = 'staff';

-- Remove default temporarily
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

-- Change column type to user_role enum
ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING role::user_role;

-- Set new default
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'applicant'::user_role;

-- PROFILES TABLE POLICIES (Updated with new roles)
CREATE POLICY "Users can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = id
    OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT auth.uid())
      AND p.role = 'administrator'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK (
    (SELECT auth.uid()) = id 
    AND role = (SELECT role FROM profiles WHERE id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'administrator'
    )
  );

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

-- LOUNGES TABLE POLICIES (Updated with new roles)
CREATE POLICY "Public can view active lounges"
  ON lounges FOR SELECT
  USING (
    status = 'active'
    OR
    (
      auth.role() = 'authenticated'
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role IN ('administrator', 'lounge_manager', 'protocol_officer')
      )
    )
  );

CREATE POLICY "Staff can manage lounges"
  ON lounges FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('administrator', 'lounge_manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('administrator', 'lounge_manager')
    )
  );

-- BOOKINGS TABLE POLICIES (Updated with new roles)
CREATE POLICY "Users can view bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = user_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('administrator', 'lounge_manager', 'protocol_officer')
    )
  );

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.uid()) = user_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('administrator', 'lounge_manager', 'protocol_officer')
    )
  )
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('administrator', 'lounge_manager', 'protocol_officer')
    )
  );

-- AMENITIES TABLE POLICIES (Updated with new roles)
CREATE POLICY "Anyone can view amenities"
  ON amenities FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage amenities"
  ON amenities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'administrator'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'administrator'
    )
  );