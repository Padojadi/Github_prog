/*
  # Fix Bookings RLS Policies to Use JWT

  ## Overview
  Update bookings RLS policies to use JWT metadata instead of querying the profiles table.
  This prevents recursion issues and improves performance.

  ## Changes

  ### 1. Drop Old Policies
    - Remove policies that query the profiles table

  ### 2. Create New JWT-Based Policies
    - Use auth.jwt()->>'user_role' to check user permissions
    - Admins, agents, and managers can view/update all bookings
    - Users can only view/update their own bookings

  ## Security
    - Maintains same access control but using JWT claims
    - Prevents RLS recursion issues
    - Improves query performance
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Staff can view all bookings
CREATE POLICY "Staff can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'user_role')::text IN ('admin', 'agent', 'manager')
  );

-- Users can create their own bookings
CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Staff can update all bookings
CREATE POLICY "Staff can update all bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'user_role')::text IN ('admin', 'agent', 'manager')
  )
  WITH CHECK (
    (auth.jwt()->>'user_role')::text IN ('admin', 'agent', 'manager')
  );
