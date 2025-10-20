-- Carousel Management Schema
-- Run this SQL in your Supabase SQL Editor

-- Carousel slides table
CREATE TABLE IF NOT EXISTS carousel_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  button_text TEXT DEFAULT 'Shop Now',
  button_link TEXT DEFAULT '/costumes',
  background_image TEXT,
  background_color TEXT DEFAULT '#f8f9fa',
  text_color TEXT DEFAULT '#000000',
  button_color TEXT DEFAULT '#dc2626',
  button_text_color TEXT DEFAULT '#ffffff',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS carousel_slides_active_idx ON carousel_slides(is_active);
CREATE INDEX IF NOT EXISTS carousel_slides_order_idx ON carousel_slides(display_order);

-- Create trigger for updated_at
CREATE TRIGGER update_carousel_slides_updated_at BEFORE UPDATE ON carousel_slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to active carousel_slides"
  ON carousel_slides FOR SELECT
  USING (is_active = true);

-- Create policies for authenticated write access (for admin)
CREATE POLICY "Allow authenticated insert to carousel_slides"
  ON carousel_slides FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to carousel_slides"
  ON carousel_slides FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to carousel_slides"
  ON carousel_slides FOR DELETE
  TO authenticated
  USING (true);

-- Insert default carousel slides
INSERT INTO carousel_slides (title, subtitle, description, button_text, button_link, background_image, background_color, text_color, button_color, button_text_color, display_order) VALUES
  (
    'HALLOWEEN SALE',
    'UP TO 75% OFF',
    'Get ready for the spookiest season with our amazing costume collection!',
    'SHOP NOW',
    '/costumes?category=halloween',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    '#dc2626',
    '#ffffff',
    '#ffffff',
    '#dc2626',
    1
  ),
  (
    'PRE-HOLIDAY SALE',
    'SALE',
    'From T-Rex dinosaurs to Disney characters. We have a wide variety of inflatable costumes to make your next event unforgettable.',
    'SHOP NOW',
    '/costumes',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80',
    '#f8f9fa',
    '#1e40af',
    '#dc2626',
    '#ffffff',
    2
  ),
  (
    'PREMIUM COSTUME RENTALS',
    'Rent Instagramable Costumes',
    'Budget friendly and quality costumes for any occasion. Make your event unforgettable!',
    'BROWSE COSTUMES',
    '/costumes',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    '#1e40af',
    '#ffffff',
    '#ffffff',
    '#1e40af',
    3
  )
ON CONFLICT DO NOTHING;
