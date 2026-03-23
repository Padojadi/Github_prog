/*
  # Fix Bookings RLS Policies for Staff Roles

  1. Problem
    - Current RLS policies for bookings check for 'admin', 'manager', 'agent' roles
    - Actual roles in database are 'administrator', 'protocol_officer', 'lounge_manager', 'security', 'admin', 'staff'
    - This prevents staff from viewing and managing bookings

  2. Changes
    - Update bookings table policies to recognize correct staff roles
    - Staff roles: 'administrator', 'protocol_officer', 'lounge_manager', 'security', 'admin', 'staff'

  3. Security
    - Maintains RLS security
    - Only allows staff members to view and manage all bookings
    - Regular users can only see their own bookings
*/

-- Drop existing staff policies for bookings
DROP POLICY IF EXISTS "Staff can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Staff can update all bookings" ON bookings;

-- Create new policy for staff to view all bookings
CREATE POLICY "Staff can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') = ANY (
      ARRAY['administrator', 'protocol_officer', 'lounge_manager', 'security', 'admin', 'staff']
    )
  );

-- Create new policy for staff to update all bookings
CREATE POLICY "Staff can update all bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') = ANY (
      ARRAY['administrator', 'protocol_officer', 'lounge_manager', 'security', 'admin', 'staff']
    )
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR 
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'user_role'), '') = ANY (
      ARRAY['administrator', 'protocol_officer', 'lounge_manager', 'security', 'admin', 'staff']
    )
  );