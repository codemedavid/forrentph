-- Site Settings Schema for Dynamic Content Management
-- Run this SQL in your Supabase SQL Editor

-- Site Settings Table for dynamic content
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT NOT NULL, -- 'about', 'home', 'contact', etc.
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS site_settings_key_idx ON site_settings(key);
CREATE INDEX IF NOT EXISTS site_settings_category_idx ON site_settings(category);

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to site_settings"
  ON site_settings FOR SELECT
  USING (true);

-- Create policies for authenticated write access (for admin)
CREATE POLICY "Allow authenticated insert to site_settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to site_settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete to site_settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (true);

-- Insert default About Us content
INSERT INTO site_settings (key, value, category, description) VALUES
  (
    'about_hero',
    '{
      "title": "About CostumeRental",
      "subtitle": "Making every event memorable with high-quality costume rentals since 2015."
    }'::jsonb,
    'about',
    'About page hero section content'
  ),
  (
    'about_story',
    '{
      "title": "Our Story",
      "paragraphs": [
        "CostumeRental was founded in 2015 with a simple mission: to make every event unforgettable through amazing costumes. What started as a small local business has grown into the region''s premier costume rental service.",
        "We believe that the right costume can transform any event from ordinary to extraordinary. Whether it''s a birthday party, corporate event, Halloween celebration, or themed gathering, we have the perfect costume to make your event stand out.",
        "Our team is passionate about costumes and committed to providing exceptional service. We carefully curate our collection to ensure every costume meets our high standards for quality, authenticity, and fun factor."
      ],
      "statsTitle": "Over 500+ Costumes",
      "statsSubtitle": "From inflatable fun to character classics"
    }'::jsonb,
    'about',
    'About page story section'
  ),
  (
    'about_stats',
    '{
      "stats": [
        {
          "icon": "Users",
          "value": "10,000+",
          "label": "Happy Customers"
        },
        {
          "icon": "Star",
          "value": "4.9",
          "label": "Average Rating"
        },
        {
          "icon": "Award",
          "value": "500+",
          "label": "Costumes Available"
        },
        {
          "icon": "Heart",
          "value": "9",
          "label": "Years of Service"
        }
      ]
    }'::jsonb,
    'about',
    'About page statistics section'
  ),
  (
    'about_values',
    '{
      "title": "Our Values",
      "subtitle": "The principles that guide everything we do",
      "values": [
        {
          "icon": "CheckCircle",
          "iconColor": "green",
          "title": "Quality First",
          "description": "Every costume in our collection is carefully selected and maintained to ensure the highest quality and authenticity."
        },
        {
          "icon": "Users",
          "iconColor": "blue",
          "title": "Customer Service",
          "description": "Our friendly and knowledgeable team is here to help you find the perfect costume and ensure your event is a success."
        },
        {
          "icon": "Heart",
          "iconColor": "purple",
          "title": "Fun & Creativity",
          "description": "We believe in the power of costumes to bring joy and creativity to any event, making memories that last a lifetime."
        }
      ]
    }'::jsonb,
    'about',
    'About page values section'
  ),
  (
    'why_choose_us',
    '{
      "title": "Why Choose Us?",
      "subtitle": "Here''s what sets us apart from the competition",
      "features": [
        {
          "title": "Extensive Collection",
          "description": "Over 500 costumes across 6 categories, from inflatable fun to character classics."
        },
        {
          "title": "Flexible Rental Options",
          "description": "Choose from 12 hours, 1 day, 3 days, or 1 week rentals to fit your event needs."
        },
        {
          "title": "Easy Online Booking",
          "description": "Simple booking process with real-time availability and instant confirmation."
        },
        {
          "title": "Professional Quality",
          "description": "All costumes are professionally cleaned and maintained to ensure perfect condition."
        },
        {
          "title": "Delivery & Pickup",
          "description": "Convenient delivery and pickup services available within a 20-mile radius."
        },
        {
          "title": "Expert Support",
          "description": "Our costume experts are available to help you choose the perfect outfit for your event."
        }
      ]
    }'::jsonb,
    'about',
    'Why Choose Us section content'
  ),
  (
    'home_why_choose_us',
    '{
      "title": "Why Choose Us?",
      "subtitle": "We make costume rental easy, affordable, and fun for everyone.",
      "features": [
        {
          "icon": "Clock",
          "title": "Flexible Rental Periods",
          "description": "Choose from 12 hours, 1 day, 3 days, or 1 week rentals. Perfect for any event duration."
        },
        {
          "icon": "Users",
          "title": "Easy Booking Process",
          "description": "Simple online booking with real-time availability. Check dates and book instantly."
        },
        {
          "icon": "Star",
          "title": "High Quality Costumes",
          "description": "Premium costumes that are clean, well-maintained, and guaranteed to impress."
        }
      ]
    }'::jsonb,
    'home',
    'Home page Why Choose Us section'
  ),
  (
    'about_cta',
    '{
      "title": "Ready to Make Your Event Unforgettable?",
      "description": "Browse our collection of amazing costumes and find the perfect one for your next event.",
      "primaryButtonText": "Browse Costumes",
      "primaryButtonLink": "/costumes",
      "secondaryButtonText": "Contact Us",
      "secondaryButtonLink": "/contact"
    }'::jsonb,
    'about',
    'About page call-to-action section'
  ),
  (
    'header_branding',
    '{
      "companyName": "ForRentPH",
      "companyFullName": "ForRentPH - Inflatable Costumes Rentals",
      "tagline": "Where fun comes alive",
      "logoEmoji": "🎭"
    }'::jsonb,
    'header',
    'Header branding - company name, tagline, and logo'
  )
ON CONFLICT (key) DO NOTHING;

