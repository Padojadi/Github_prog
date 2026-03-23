/*
  # Synchronize User Roles to JWT Metadata
  
  1. Changes
    - Drop the previous incorrect policies
    - Create a function to sync role from profiles to auth.users metadata
    - Create a trigger to automatically sync role on profile insert/update
    - Update existing users to add role to their metadata
    - Create new RLS policies that use JWT metadata (no recursion!)
  
  2. Security
    - Administrators can view and manage all profiles
    - Regular users can only view/update their own profile
    - No recursion in RLS policies
    
  3. Implementation Notes
    - Role is stored in both profiles table and auth.users.raw_app_meta_data
    - JWT contains the role, accessible via auth.jwt()->>'role'
    - Trigger ensures automatic synchronization
*/

-- Drop the incorrect policies from previous migration
DROP POLICY IF EXISTS "Administrators can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Administrators can update all profiles" ON profiles;

-- Create function to sync role to auth metadata
CREATE OR REPLACE FUNCTION sync_role_to_auth_metadata()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the user's raw_app_meta_data with the role
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role::text)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-sync role on insert/update
DROP TRIGGER IF EXISTS sync_role_to_auth_on_profile_change ON profiles;
CREATE TRIGGER sync_role_to_auth_on_profile_change
  AFTER INSERT OR UPDATE OF role ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_role_to_auth_metadata();

-- Update existing users to add role to metadata
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN 
    SELECT id, role FROM profiles
  LOOP
    UPDATE auth.users
    SET raw_app_meta_data = 
      COALESCE(raw_app_meta_data, '{}'::jsonb) || 
      jsonb_build_object('role', profile_record.role::text)
    WHERE id = profile_record.id;
  END LOOP;
END $$;

-- Now create RLS policies that use JWT metadata (no recursion!)
CREATE POLICY "Administrators can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'raw_app_meta_data')::jsonb->>'role', '') = 'administrator'
  );

CREATE POLICY "Administrators can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    COALESCE((auth.jwt()->>'raw_app_meta_data')::jsonb->>'role', '') = 'administrator'
  )
  WITH CHECK (
    COALESCE((auth.jwt()->>'raw_app_meta_data')::jsonb->>'role', '') = 'administrator'
  );
