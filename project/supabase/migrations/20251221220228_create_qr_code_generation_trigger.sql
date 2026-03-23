/*
  # Create QR Code Generation Trigger

  1. New Functions
    - generate_booking_qr_code: Generates QR code data when booking is confirmed
    
  2. New Triggers
    - trigger_generate_qr_code: Automatically generates QR code data on status change to 'confirmed'
    
  3. QR Code Data Format
    - JSON containing: booking_id, lounge_name, customer_name, start_time, end_time, amenities
*/

-- Create function to generate QR code data
CREATE OR REPLACE FUNCTION generate_booking_qr_code()
RETURNS TRIGGER AS $$
DECLARE
  lounge_record RECORD;
  profile_record RECORD;
  amenities_list text[];
BEGIN
  -- Only generate QR code if status changed to 'confirmed' and qr_code_data is null
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') AND NEW.qr_code_data IS NULL THEN
    
    -- Get lounge details
    SELECT name, location INTO lounge_record
    FROM lounges
    WHERE id = NEW.lounge_id;
    
    -- Get profile details
    SELECT full_name, email INTO profile_record
    FROM profiles
    WHERE id = NEW.user_id;
    
    -- Get amenities for this lounge
    SELECT array_agg(name) INTO amenities_list
    FROM amenities
    WHERE lounge_id = NEW.lounge_id;
    
    -- Generate QR code data as JSON
    NEW.qr_code_data := json_build_object(
      'booking_id', NEW.id,
      'lounge_name', lounge_record.name,
      'lounge_location', lounge_record.location,
      'customer_name', profile_record.full_name,
      'customer_email', profile_record.email,
      'start_time', NEW.start_time,
      'end_time', NEW.end_time,
      'num_guests', NEW.num_guests,
      'amenities', COALESCE(amenities_list, ARRAY[]::text[]),
      'generated_at', now()
    )::text;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_generate_qr_code ON bookings;
CREATE TRIGGER trigger_generate_qr_code
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION generate_booking_qr_code();