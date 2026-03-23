/*
  # Fix JWT Sync to Update user_role Field

  1. Problem
    - The sync function only updates 'role' in app_metadata
    - RLS policies check 'user_role' in app_metadata
    - This causes a mismatch and prevents staff from accessing data

  2. Changes
    - Update the sync function to set both 'role' and 'user_role' in app_metadata
    - This ensures compatibility with existing RLS policies

  3. Migration Steps
    - Update the function definition
    - Force update all existing users to sync their metadata
*/

-- Update the sync function to set both role and user_role
CREATE OR REPLACE FUNCTION sync_role_to_auth_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's raw_app_meta_data with both role and user_role
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'role', NEW.role::text,
      'user_role', NEW.role::text
    )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';

-- Force update all existing profiles to sync their metadata
UPDATE profiles
SET updated_at = now()
WHERE TRUE;