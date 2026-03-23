/*
  # Fix RLS Recursion for Administrator Profile Access
  
  1. Changes
    - Drop the problematic policies that cause recursion
    - Use auth.jwt() to check role from JWT metadata instead of querying profiles table
    - This prevents infinite recursion when administrators try to load their own profile
  
  2. Security
    - Administrators can view and update all profiles (checked via JWT)
    - Regular users can only view/update their own profile
    - No recursion issues
*/

-- Drop the problematic policies
DROP POLICY IF EXISTS "Administrators can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Administrators can update all profiles" ON profiles;

-- Recreate with JWT-based role checking (no recursion)
CREATE POLICY "Administrators can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text = 'administrator'
  );

CREATE POLICY "Administrators can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text = 'administrator'
  )
  WITH CHECK (
    (auth.jwt()->>'role')::text = 'administrator'
  );
