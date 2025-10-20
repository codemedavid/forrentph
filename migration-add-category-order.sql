-- Migration: Add display_order to categories table
-- This allows custom ordering of categories in the catalog

-- Add display_order column
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0 NOT NULL;

-- Create index for faster sorting
CREATE INDEX IF NOT EXISTS categories_display_order_idx ON categories(display_order);

-- Set initial order based on current category names
-- You can customize these values based on your preference
UPDATE categories SET display_order = 1 WHERE slug = 'inflatable-costumes';
UPDATE categories SET display_order = 2 WHERE slug = 'character-costumes';
UPDATE categories SET display_order = 3 WHERE slug = 'animal-costumes';
UPDATE categories SET display_order = 4 WHERE slug = 'historical-costumes';
UPDATE categories SET display_order = 5 WHERE slug = 'superhero-costumes';
UPDATE categories SET display_order = 6 WHERE slug = 'horror-costumes';

-- For any new categories, set order to max + 1
UPDATE categories 
SET display_order = (SELECT COALESCE(MAX(display_order), 0) + 1 FROM categories WHERE display_order > 0)
WHERE display_order = 0;

-- Add comment to column
COMMENT ON COLUMN categories.display_order IS 'Display order in catalog (lower numbers appear first)';

