/*
  # Fix JWT Role Access in RLS Policies
  
  1. Changes
    - Drop the incorrect policies that use wrong JWT path
    - Create corrected policies with proper JWT metadata access
    - Correct path: auth.jwt()->'raw_app_meta_data'->>'role'
  
  2. Security
    - Administrators can view and manage all profiles
    - Uses JWT metadata to avoid recursion
*/

-- Drop incorrect policies
DROP POLICY IF EXISTS "Administrators can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Administrators can update all profiles" ON profiles;

-- Create corrected policies with proper JWT access
CREATE POLICY "Administrators can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->'raw_app_meta_data'->>'role'), '') = 'administrator'
  );

CREATE POLICY "Administrators can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt()->'raw_app_meta_data'->>'role'), '') = 'administrator'
  )
  WITH CHECK (
    COALESCE((auth.jwt()->'raw_app_meta_data'->>'role'), '') = 'administrator'
  );
