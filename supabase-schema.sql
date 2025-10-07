-- Supabase Database Schema for Costume Rental
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Costumes Table
CREATE TABLE IF NOT EXISTS costumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  price_per_day NUMERIC(10, 2) NOT NULL,
  price_per_12_hours NUMERIC(10, 2) NOT NULL,
  price_per_week NUMERIC(10, 2) NOT NULL,
  size TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  setup_time INTEGER NOT NULL,
  features TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  costume_id UUID REFERENCES costumes(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS costumes_category_id_idx ON costumes(category_id);
CREATE INDEX IF NOT EXISTS costumes_slug_idx ON costumes(slug);
CREATE INDEX IF NOT EXISTS costumes_is_available_idx ON costumes(is_available);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories(slug);
CREATE INDEX IF NOT EXISTS bookings_costume_id_idx ON bookings(costume_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);
CREATE INDEX IF NOT EXISTS bookings_dates_idx ON bookings(start_date, end_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_costumes_updated_at BEFORE UPDATE ON costumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE costumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to costumes"
  ON costumes FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to bookings"
  ON bookings FOR SELECT
  USING (true);

-- Create policies for authenticated write access (for admin)
CREATE POLICY "Allow authenticated insert to categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert to costumes"
  ON costumes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to costumes"
  ON costumes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to costumes"
  ON costumes FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert to bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);

-- Insert initial categories
INSERT INTO categories (name, description, image, slug) VALUES
  ('Inflatable Costumes', 'Fun and eye-catching inflatable costumes perfect for parties and events', '/images/categories/inflatable.jpg', 'inflatable-costumes'),
  ('Character Costumes', 'Popular character costumes from movies, TV shows, and games', '/images/categories/characters.jpg', 'character-costumes'),
  ('Animal Costumes', 'Adorable and realistic animal costumes for all ages', '/images/categories/animals.jpg', 'animal-costumes'),
  ('Historical Costumes', 'Period costumes from different eras and cultures', '/images/categories/historical.jpg', 'historical-costumes'),
  ('Superhero Costumes', 'Powerful superhero costumes for comic book fans', '/images/categories/superheroes.jpg', 'superhero-costumes'),
  ('Horror Costumes', 'Spooky and scary costumes for Halloween and themed events', '/images/categories/horror.jpg', 'horror-costumes')
ON CONFLICT (slug) DO NOTHING;

-- Insert initial costumes
INSERT INTO costumes (name, description, category_id, images, price_per_day, price_per_12_hours, price_per_week, size, difficulty, setup_time, features, is_available, slug) VALUES
  ('Inflatable T-Rex Costume', 'A hilarious inflatable T-Rex costume that will make you the life of any party. Features realistic dinosaur design with built-in fan for easy inflation.', (SELECT id FROM categories WHERE slug = 'inflatable-costumes'), ARRAY['/images/costumes/inflatable-trex-1.jpg'], 2500, 1400, 11000, 'One Size', 'Easy', 5, ARRAY['Built-in fan', 'Easy to wear', 'Comfortable', 'Eye-catching'], true, 'inflatable-trex-costume'),
  ('Inflatable Unicorn Costume', 'Magical inflatable unicorn costume perfect for birthday parties and fantasy events. Features rainbow colors and sparkly details.', (SELECT id FROM categories WHERE slug = 'inflatable-costumes'), ARRAY['/images/costumes/inflatable-unicorn-1.jpg'], 2200, 1200, 9900, 'One Size', 'Easy', 5, ARRAY['Rainbow colors', 'Sparkly details', 'Built-in fan', 'Magical appearance'], true, 'inflatable-unicorn-costume'),
  ('Inflatable Sumo Wrestler', 'Fun inflatable sumo wrestler costume that will have everyone laughing. Perfect for parties and team building events.', (SELECT id FROM categories WHERE slug = 'inflatable-costumes'), ARRAY['/images/costumes/inflatable-sumo-1.jpg'], 1900, 1100, 8800, 'One Size', 'Easy', 5, ARRAY['Hilarious design', 'Built-in fan', 'Easy movement', 'Party favorite'], true, 'inflatable-sumo-wrestler'),
  ('Inflatable Hot Dog Costume', 'Classic inflatable hot dog costume that never goes out of style. Great for food-themed parties and casual events.', (SELECT id FROM categories WHERE slug = 'inflatable-costumes'), ARRAY['/images/costumes/inflatable-hotdog-1.jpg'], 1650, 990, 7700, 'One Size', 'Easy', 5, ARRAY['Classic design', 'Built-in fan', 'Comfortable', 'Versatile'], true, 'inflatable-hotdog-costume'),
  ('Inflatable Shark Costume', 'Scary and fun inflatable shark costume perfect for beach parties and ocean-themed events.', (SELECT id FROM categories WHERE slug = 'inflatable-costumes'), ARRAY['/images/costumes/inflatable-shark-1.jpg'], 2100, 1150, 9350, 'One Size', 'Easy', 5, ARRAY['Realistic design', 'Built-in fan', 'Scary appearance', 'Beach party favorite'], true, 'inflatable-shark-costume'),
  ('Inflatable Pizza Slice', 'Delicious inflatable pizza slice costume that will make everyone hungry. Perfect for food festivals and casual parties.', (SELECT id FROM categories WHERE slug = 'inflatable-costumes'), ARRAY['/images/costumes/inflatable-pizza-1.jpg'], 1750, 1050, 8250, 'One Size', 'Easy', 5, ARRAY['Appetizing design', 'Built-in fan', 'Food-themed', 'Fun and casual'], true, 'inflatable-pizza-slice'),
  ('Spider-Man Costume', 'Authentic Spider-Man costume with detailed web pattern and mask. Perfect for superhero themed events.', (SELECT id FROM categories WHERE slug = 'character-costumes'), ARRAY['/images/costumes/spiderman-1.jpg'], 2750, 1540, 12100, 'M', 'Medium', 10, ARRAY['Authentic design', 'Detailed web pattern', 'Includes mask', 'High quality material'], true, 'spiderman-costume'),
  ('Batman Costume', 'Dark Knight Batman costume with cape and utility belt. Includes mask and gloves for the complete look.', (SELECT id FROM categories WHERE slug = 'character-costumes'), ARRAY['/images/costumes/batman-1.jpg'], 3000, 1650, 13200, 'L', 'Medium', 15, ARRAY['Complete set', 'Cape included', 'Utility belt', 'Professional quality'], true, 'batman-costume'),
  ('Lion Costume', 'Majestic lion costume with realistic mane and tail. Perfect for safari themed parties and children events.', (SELECT id FROM categories WHERE slug = 'animal-costumes'), ARRAY['/images/costumes/lion-1.jpg'], 2300, 1320, 10450, 'L', 'Easy', 8, ARRAY['Realistic mane', 'Comfortable fit', 'Durable material', 'Safari themed'], true, 'lion-costume'),
  ('Panda Costume', 'Adorable panda costume with black and white fur design. Great for zoo themed events and children parties.', (SELECT id FROM categories WHERE slug = 'animal-costumes'), ARRAY['/images/costumes/panda-1.jpg'], 2100, 1210, 9350, 'M', 'Easy', 8, ARRAY['Soft material', 'Adorable design', 'Comfortable', 'Child-friendly'], true, 'panda-costume')
ON CONFLICT (slug) DO NOTHING;

