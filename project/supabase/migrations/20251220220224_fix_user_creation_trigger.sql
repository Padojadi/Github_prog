/*
  # Fix User Creation Trigger
  
  1. Changes
    - Update handle_new_user() function to properly insert all user metadata
    - Include phone number from user metadata
    - Ensure proper error handling
  
  2. Notes
    - This fixes the issue where users created through the edge function
      or registration form don't get their complete profile data
*/

-- Drop and recreate the trigger function with improved logic
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, just return
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail the auth user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public', 'auth';
