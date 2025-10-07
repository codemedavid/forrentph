-- Add blocking fields to bookings table for 10-minute reservation system
-- Run this AFTER running supabase-schema.sql

-- Add new columns to support temporary blocking
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS blocked_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS messenger_opened BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS booking_reference TEXT UNIQUE;

-- Create index for efficient blocking queries
CREATE INDEX IF NOT EXISTS bookings_blocked_until_idx ON bookings(blocked_until) 
WHERE status = 'pending' AND blocked_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS bookings_reference_idx ON bookings(booking_reference);

-- Function to auto-expire bookings after 10 minutes
CREATE OR REPLACE FUNCTION expire_pending_bookings()
RETURNS void AS $$
BEGIN
  UPDATE bookings
  SET status = 'expired',
      updated_at = TIMEZONE('utc'::text, NOW())
  WHERE status = 'pending'
    AND blocked_until IS NOT NULL
    AND blocked_until < TIMEZONE('utc'::text, NOW());
END;
$$ LANGUAGE plpgsql;

-- Add 'expired' to status check if not already there
DO $$ 
BEGIN
  -- Drop the old constraint
  ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
  
  -- Add new constraint with 'expired' status
  ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'expired'));
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create a function to check if a costume is blocked for specific dates
CREATE OR REPLACE FUNCTION is_costume_blocked(
  p_costume_id UUID,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_blocked BOOLEAN;
BEGIN
  -- First, expire any old pending bookings
  PERFORM expire_pending_bookings();
  
  -- Check if there's any active booking or blocking
  SELECT EXISTS (
    SELECT 1 FROM bookings
    WHERE costume_id = p_costume_id
    AND status IN ('confirmed', 'pending')
    AND (
      -- Either confirmed bookings
      (status = 'confirmed' AND start_date <= p_end_date AND end_date >= p_start_date)
      OR
      -- Or pending bookings still within block period
      (status = 'pending' AND blocked_until > TIMEZONE('utc'::text, NOW()) 
       AND start_date <= p_end_date AND end_date >= p_start_date)
    )
  ) INTO v_is_blocked;
  
  RETURN v_is_blocked;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE bookings IS 'Stores all costume rental bookings with 10-minute temporary blocking';
COMMENT ON COLUMN bookings.blocked_until IS 'Timestamp when the temporary 10-minute block expires (for pending bookings)';
COMMENT ON COLUMN bookings.messenger_opened IS 'Whether the customer opened Messenger link';
COMMENT ON COLUMN bookings.booking_reference IS 'Unique reference code for this booking (e.g., BOOK-123456)';

