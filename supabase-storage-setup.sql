-- Supabase Storage Setup for Costume Images
-- Run this after setting up the main database schema

-- Create storage bucket for costume images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'costume-images',
  'costume-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for public read access
CREATE POLICY "Public Access to Costume Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'costume-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload costume images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'costume-images');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update costume images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'costume-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete costume images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'costume-images');

-- Alternative: Allow anyone to upload (less secure, but simpler for development)
-- Uncomment these if you want to allow uploads without authentication

-- CREATE POLICY "Anyone can upload costume images"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'costume-images');

-- CREATE POLICY "Anyone can update costume images"
-- ON storage.objects FOR UPDATE
-- USING (bucket_id = 'costume-images');

-- CREATE POLICY "Anyone can delete costume images"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'costume-images');

