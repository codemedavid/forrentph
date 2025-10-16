-- Migration: Add icon column to categories table
-- Run this in Supabase SQL Editor if your database already exists

-- Add icon column with default emoji
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🎭';

-- Update existing categories with default icon if null
UPDATE categories 
SET icon = '🎭' 
WHERE icon IS NULL OR icon = '';

-- Add helpful comment
COMMENT ON COLUMN categories.icon IS 'Emoji or icon character to represent the category';

-- Verify the change
SELECT id, name, icon, slug FROM categories;

