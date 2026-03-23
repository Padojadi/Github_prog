/*
  # Fix RLS Performance and Security Issues

  ## Overview
  This migration addresses performance and security issues identified by Supabase:
  1. Optimizes RLS policies by wrapping auth functions in SELECT to prevent re-evaluation per row
  2. Sets explicit search_path on functions for security
  3. Consolidates duplicate permissive policies where appropriate

  ## Changes Made
  - Drop and recreate all RLS policies with optimized auth function calls
  - Add search_path to all functions
  - Optimize policies to reduce duplication where possible

  ## Security Improvements
  - Functions now have explicit search_path set
  - Auth functions are evaluated once per query instead of per row
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Anyone can view active lounges" ON lounges;
DROP POLICY IF EXISTS "Authenticated users can view all lounges" ON lounges;
DROP POLICY IF EXISTS "Admins and staff can insert lounges" ON lounges;
DROP POLICY IF EXISTS "Admins and staff can update lounges" ON lounges;
DROP POLICY IF EXISTS "Admins can delete lounges" ON lounges;

DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins and staff can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Admins and staff can update bookings" ON bookings;

DROP POLICY IF EXISTS "Anyone can view amenities" ON amenities;
DROP POLICY IF EXISTS "Admins can insert amenities" ON amenities;
DROP POLICY IF EXISTS "Admins can update amenities" ON amenities;
DROP POLICY IF EXISTS "Admins can delete amenities" ON amenities;

-- PROFILES TABLE POLICIES (Optimized)
CREATE POLICY "Users can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = id
    OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT auth.uid())
      AND p.role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK (
    (SELECT auth.uid()) = id 
    AND role = (SELECT role FROM profiles WHERE id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

-- LOUNGES TABLE POLICIES (Optimized)
CREATE POLICY "Public can view active lounges"
  ON lounges FOR SELECT
  USING (
    status = 'active'
    OR
    (
      auth.role() = 'authenticated'
      AND EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role IN ('admin', 'staff')
      )
    )
  );

CREATE POLICY "Staff can manage lounges"
  ON lounges FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'staff')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- BOOKINGS TABLE POLICIES (Optimized)
CREATE POLICY "Users can view bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = user_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.uid()) = user_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'staff')
    )
  )
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- AMENITIES TABLE POLICIES (Optimized)
CREATE POLICY "Anyone can view amenities"
  ON amenities FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage amenities"
  ON amenities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (SELECT auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Fix function security by adding explicit search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION check_lounge_availability(
  p_lounge_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz,
  p_booking_id uuid DEFAULT NULL
)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE lounge_id = p_lounge_id
    AND status IN ('pending', 'confirmed')
    AND (id != p_booking_id OR p_booking_id IS NULL)
    AND (
      (start_time <= p_start_time AND end_time > p_start_time)
      OR (start_time < p_end_time AND end_time >= p_end_time)
      OR (start_time >= p_start_time AND end_time <= p_end_time)
    )
  );
END;
$$;