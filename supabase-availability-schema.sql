-- Costume Availability Management Schema
-- Run this SQL to add availability blocking functionality

-- Create availability_blocks table
CREATE TABLE IF NOT EXISTS availability_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  costume_id UUID REFERENCES costumes(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Ensure end_date is not before start_date
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS availability_blocks_costume_id_idx ON availability_blocks(costume_id);
CREATE INDEX IF NOT EXISTS availability_blocks_dates_idx ON availability_blocks(start_date, end_date);

-- Create trigger for updated_at
CREATE TRIGGER update_availability_blocks_updated_at BEFORE UPDATE ON availability_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE availability_blocks ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to availability blocks"
  ON availability_blocks FOR SELECT
  USING (true);

-- Create policies for authenticated write access (for admin)
CREATE POLICY "Allow authenticated insert to availability blocks"
  ON availability_blocks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to availability blocks"
  ON availability_blocks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to availability blocks"
  ON availability_blocks FOR DELETE
  TO authenticated
  USING (true);

-- Create function to check if a costume is available for a date range
CREATE OR REPLACE FUNCTION check_costume_availability(
  p_costume_id UUID,
  p_start_date DATE,
  p_end_date DATE
) RETURNS TABLE (
  is_available BOOLEAN,
  blocked_dates TEXT[]
) AS $$
DECLARE
  blocked_count INTEGER;
  blocked_date_array TEXT[];
BEGIN
  -- Check for overlapping availability blocks
  SELECT COUNT(*), ARRAY_AGG(DISTINCT to_char(d.date, 'YYYY-MM-DD'))
  INTO blocked_count, blocked_date_array
  FROM availability_blocks ab
  CROSS JOIN LATERAL generate_series(
    GREATEST(ab.start_date, p_start_date),
    LEAST(ab.end_date, p_end_date),
    '1 day'::interval
  ) AS d(date)
  WHERE ab.costume_id = p_costume_id
    AND ab.start_date <= p_end_date
    AND ab.end_date >= p_start_date;

  -- Check for overlapping bookings
  SELECT COUNT(*) + COALESCE(blocked_count, 0)
  INTO blocked_count
  FROM bookings b
  WHERE b.costume_id = p_costume_id
    AND b.status IN ('confirmed', 'pending')
    AND b.start_date::date <= p_end_date
    AND b.end_date::date >= p_start_date;

  RETURN QUERY SELECT 
    (blocked_count = 0) AS is_available,
    COALESCE(blocked_date_array, ARRAY[]::TEXT[]) AS blocked_dates;
END;
$$ LANGUAGE plpgsql;

-- Create function to get blocked dates for a costume in a month
CREATE OR REPLACE FUNCTION get_blocked_dates_for_month(
  p_costume_id UUID,
  p_year INTEGER,
  p_month INTEGER
) RETURNS TABLE (
  blocked_date DATE,
  reason TEXT,
  block_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- Get dates from availability blocks
  SELECT 
    d.date::date AS blocked_date,
    ab.reason,
    'manual_block'::text AS block_type
  FROM availability_blocks ab
  CROSS JOIN LATERAL generate_series(
    ab.start_date,
    ab.end_date,
    '1 day'::interval
  ) AS d(date)
  WHERE ab.costume_id = p_costume_id
    AND EXTRACT(YEAR FROM d.date) = p_year
    AND EXTRACT(MONTH FROM d.date) = p_month
  
  UNION
  
  -- Get dates from confirmed/pending bookings
  SELECT 
    d.date::date AS blocked_date,
    'Booked by ' || b.customer_name AS reason,
    'booking'::text AS block_type
  FROM bookings b
  CROSS JOIN LATERAL generate_series(
    b.start_date::date,
    b.end_date::date,
    '1 day'::interval
  ) AS d(date)
  WHERE b.costume_id = p_costume_id
    AND b.status IN ('confirmed', 'pending')
    AND EXTRACT(YEAR FROM d.date) = p_year
    AND EXTRACT(MONTH FROM d.date) = p_month
  
  ORDER BY blocked_date;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON TABLE availability_blocks IS 'Stores date ranges when costumes are unavailable for rental';
COMMENT ON FUNCTION check_costume_availability IS 'Check if a costume is available for a specific date range';
COMMENT ON FUNCTION get_blocked_dates_for_month IS 'Get all blocked dates for a costume in a specific month';

