/*
  # Add Payment and QR Code Fields to Bookings

  1. Changes
    - Add `payment_method` field to bookings table (online or on_site)
    - Add `payment_status` field to bookings table (pending, completed, failed)
    - Add `qr_code_data` field to store QR code information for validated bookings
    
  2. New Fields
    - payment_method: enum('online', 'on_site') - How the customer wants to pay
    - payment_status: enum('pending', 'completed', 'failed') - Payment status
    - qr_code_data: text - JSON data for QR code generation
    
  3. Notes
    - Default payment_method is 'on_site' for backward compatibility
    - Default payment_status is 'pending'
    - QR code data is generated when booking status changes to 'confirmed'
*/

-- Add payment_method enum type if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method_type') THEN
    CREATE TYPE payment_method_type AS ENUM ('online', 'on_site');
  END IF;
END $$;

-- Add payment_status enum type if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_type') THEN
    CREATE TYPE payment_status_type AS ENUM ('pending', 'completed', 'failed');
  END IF;
END $$;

-- Add payment_method column to bookings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE bookings ADD COLUMN payment_method payment_method_type DEFAULT 'on_site';
  END IF;
END $$;

-- Add payment_status column to bookings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE bookings ADD COLUMN payment_status payment_status_type DEFAULT 'pending';
  END IF;
END $$;

-- Add qr_code_data column to bookings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'qr_code_data'
  ) THEN
    ALTER TABLE bookings ADD COLUMN qr_code_data text;
  END IF;
END $$;

-- Create index on payment_status for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);

-- Create index on payment_method for analytics
CREATE INDEX IF NOT EXISTS idx_bookings_payment_method ON bookings(payment_method);