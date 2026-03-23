/*
  # Fix infinite recursion in profiles RLS policies

  ## Problem
  The RLS policies on `profiles` table were causing infinite recursion because they were
  querying the same table they were protecting.

  ## Solution
  - Drop all existing policies on profiles table
  - Create new, simplified policies that don't cause recursion
  - Users can always view and update their own profile
  - No special admin checks needed for viewing profiles (admins can be handled at application level)

  ## Changes
  1. Drop all existing policies
  2. Create simple, non-recursive policies for:
     - SELECT: Users can view their own profile
     - INSERT: Users can insert their own profile  
     - UPDATE: Users can update their own profile
     - DELETE: No one can delete profiles (handled by trigger)
*/

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new simple policies without recursion
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
