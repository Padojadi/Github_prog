/*
  # Enable Realtime for Dashboard Tables

  ## Overview
  This migration enables Realtime replication for tables used in the admin dashboard,
  allowing real-time updates when data changes.

  ## Changes
  1. Enable Realtime for lounges table
  2. Enable Realtime for bookings table
  3. Enable Realtime for profiles table

  ## Notes
  - Realtime subscriptions will now broadcast INSERT, UPDATE, and DELETE events
  - The admin dashboard will automatically refresh when data changes
*/

-- Enable realtime for lounges table
ALTER PUBLICATION supabase_realtime ADD TABLE lounges;

-- Enable realtime for bookings table
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- Enable realtime for profiles table
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
