/*
  # Fix Administrator Access to All Profiles
  
  1. Changes
    - Add policy for administrators to view all profiles
    - Add policy for administrators to update all profiles
    - This fixes the issue where administrators cannot see users in the admin dashboard
  
  2. Security
    - Only users with 'administrator' role can access all profiles
    - Regular users can still only see their own profile
*/

-- Add policy for administrators to view all profiles
CREATE POLICY "Administrators can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'administrator'
    )
  );

-- Add policy for administrators to update all profiles
CREATE POLICY "Administrators can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'administrator'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'administrator'
    )
  );
