/*
  # Add Lounge Scheduling and Type Fields

  ## Overview
  This migration adds scheduling, type, and category fields to the lounges table to support 
  more detailed lounge management including booking limits and time slot management.

  ## Changes Made
  1. New Columns Added to `lounges` table:
     - `lounge_type` (text) - Type of lounge (e.g., "VIP", "Business", "Executive", "Private")
     - `category` (text) - Category of lounge (e.g., "Conference", "Meeting", "Event", "Relaxation")
     - `max_bookings` (integer) - Maximum number of simultaneous bookings allowed
     - `available_days` (jsonb) - Array of available days (e.g., ["Lundi", "Mardi", "Mercredi"])
     - `time_slots` (jsonb) - Array of available time slots with start and end times

  ## Notes
  - All new fields are nullable to maintain compatibility with existing records
  - Default values can be set when creating new lounges
  - JSON fields allow flexible scheduling configuration
*/

-- Add lounge_type column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lounges' AND column_name = 'lounge_type'
  ) THEN
    ALTER TABLE lounges ADD COLUMN lounge_type text;
  END IF;
END $$;

-- Add category column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lounges' AND column_name = 'category'
  ) THEN
    ALTER TABLE lounges ADD COLUMN category text;
  END IF;
END $$;

-- Add max_bookings column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lounges' AND column_name = 'max_bookings'
  ) THEN
    ALTER TABLE lounges ADD COLUMN max_bookings integer CHECK (max_bookings > 0);
  END IF;
END $$;

-- Add available_days column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lounges' AND column_name = 'available_days'
  ) THEN
    ALTER TABLE lounges ADD COLUMN available_days jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add time_slots column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lounges' AND column_name = 'time_slots'
  ) THEN
    ALTER TABLE lounges ADD COLUMN time_slots jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lounges_type ON lounges(lounge_type);
CREATE INDEX IF NOT EXISTS idx_lounges_category ON lounges(category);