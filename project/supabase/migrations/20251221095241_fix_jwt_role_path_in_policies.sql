/*
  # Fix JWT Role Path in RLS Policies

  1. Changes
    - Drop existing policies that use incorrect JWT path
    - Recreate policies with correct JWT path: app_metadata.role (not raw_app_meta_data)
    - In the database it's stored as raw_app_meta_data, but in JWT it's accessed as app_metadata
  
  2. Security
    - Administrators can view and update all profiles
    - Regular users can only view/update their own profile
    - All policies properly check authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Administrators can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Administrators can update all profiles" ON profiles;

-- Recreate with correct JWT path
CREATE POLICY "Administrators can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'administrator'
  );

CREATE POLICY "Administrators can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'administrator'
  )
  WITH CHECK (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'administrator'
  );
