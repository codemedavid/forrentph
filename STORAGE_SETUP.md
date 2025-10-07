# Supabase Storage Setup Guide - Image Uploads

This guide explains how to set up Supabase Storage for uploading and managing costume images.

## 📁 Overview

Your costume rental app now supports image uploads with:
- ✅ Drag-and-drop upload
- ✅ Multiple image support (up to 5 per costume)
- ✅ Image preview gallery
- ✅ Delete individual images
- ✅ Automatic primary image selection
- ✅ 5MB file size limit
- ✅ Supported formats: JPG, PNG, WebP, GIF

## 🚀 Quick Setup

### Step 1: Create Storage Bucket

1. Go to your Supabase project dashboard
2. Click **Storage** in the sidebar
3. Click **Create a new bucket**
4. Fill in:
   - **Name**: `costume-images`
   - **Public bucket**: ✅ Enable (so images are publicly accessible)
   - **File size limit**: 5MB
   - **Allowed MIME types**: Leave blank or specify: `image/jpeg, image/png, image/webp, image/gif`
5. Click **Create bucket**

### Step 2: Set Up Storage Policies

Option A: Using SQL Editor (Recommended)
1. Go to **SQL Editor**
2. Copy contents from `supabase-storage-setup.sql`
3. Click **Run**

Option B: Using Dashboard
1. Go to **Storage** → **Policies**
2. Select `costume-images` bucket
3. Create the following policies:

**Policy 1: Public Read Access**
- Policy name: `Public Access to Costume Images`
- Allowed operation: SELECT
- Target roles: `public`
- USING expression: `bucket_id = 'costume-images'`

**Policy 2: Authenticated Upload**
- Policy name: `Authenticated users can upload`
- Allowed operation: INSERT
- Target roles: `authenticated`
- WITH CHECK expression: `bucket_id = 'costume-images'`

**Policy 3: Authenticated Update**
- Policy name: `Authenticated users can update`
- Allowed operation: UPDATE
- Target roles: `authenticated`
- USING expression: `bucket_id = 'costume-images'`

**Policy 4: Authenticated Delete**
- Policy name: `Authenticated users can delete`
- Allowed operation: DELETE
- Target roles: `authenticated`
- USING expression: `bucket_id = 'costume-images'`

### Step 3: Test the Upload

1. Start your development server:
```bash
npm run dev
```

2. Go to `/admin`
3. Click **Add New Costume** or **Edit** an existing costume
4. You should see the **Costume Images** section at the top
5. Try uploading an image!

## 📸 How to Use the Image Uploader

### Uploading Images

**Method 1: Click to Upload**
1. Click anywhere in the upload area
2. Select one or more images
3. Wait for upload to complete

**Method 2: Drag and Drop**
1. Drag images from your computer
2. Drop them into the upload area
3. Wait for upload to complete

### Managing Images

- **View Images**: All uploaded images appear in a grid below the upload area
- **Delete Image**: Hover over an image and click the red X button
- **Primary Image**: The first image is automatically marked as "Primary"
- **Reorder**: Delete and re-upload to change order (first image = primary)

### Image Specifications

- **Maximum Images**: 5 per costume
- **File Size**: Up to 5MB per image
- **Formats**: JPG, PNG, WebP, GIF
- **Recommended Size**: 800x800px or larger for best quality

## 🗂️ File Structure

```
supabase/storage/
└── costume-images/
    ├── abc123-1234567890.jpg
    ├── def456-1234567891.png
    └── ghi789-1234567892.webp
```

Each image is stored with a unique filename:
- Random prefix for uniqueness
- Timestamp for ordering
- Original file extension preserved

## 🔒 Security

### Public Access
- All images in the bucket are publicly accessible
- Anyone can view images via their public URL
- This is necessary for displaying images on the website

### Upload/Delete Protection
- Only authenticated users can upload images
- Only authenticated users can delete images
- Public users cannot modify the bucket contents

### Best Practices
1. Validate file types on upload
2. Enforce size limits (5MB default)
3. Use unique filenames to prevent conflicts
4. Clean up unused images periodically

## 📝 API Endpoints

### Upload Image
```typescript
POST /api/upload
Content-Type: multipart/form-data

Request:
{
  file: File
}

Response:
{
  success: true,
  url: "https://...supabase.co/storage/v1/object/public/costume-images/...",
  path: "abc123-1234567890.jpg"
}
```

### Delete Image
```typescript
DELETE /api/upload?path=abc123-1234567890.jpg

Response:
{
  success: true,
  message: "File deleted successfully"
}
```

## 🎨 Components

### ImageUpload Component
Located at: `src/components/admin/image-upload.tsx`

Features:
- Drag and drop support
- Multiple file selection
- Real-time upload progress
- Image preview grid
- Delete functionality
- Error handling
- File validation

Usage:
```typescript
import { ImageUpload } from '@/components/admin/image-upload';

<ImageUpload
  currentImages={images}
  onImagesChange={(newImages) => setImages(newImages)}
  maxImages={5}
  bucketName="costume-images"
/>
```

## 🐛 Troubleshooting

### Images Won't Upload

**Check 1: Storage Bucket Exists**
- Go to Supabase → Storage
- Verify `costume-images` bucket is created
- Ensure it's set to "Public"

**Check 2: Policies Are Set**
- Go to Storage → Policies
- Verify all 4 policies exist
- Check they're enabled

**Check 3: Environment Variables**
- Verify `.env.local` has correct credentials
- Restart dev server after changes

**Check 4: File Size**
- Ensure images are under 5MB
- Try with a smaller image

**Check 5: File Type**
- Only JPG, PNG, WebP, GIF allowed
- Check console for validation errors

### Images Won't Display

**Problem**: Uploaded images show as broken
**Solution**: 
1. Check bucket is set to "Public"
2. Verify public URL format is correct
3. Check browser console for CORS errors

### Can't Delete Images

**Problem**: Delete button doesn't work
**Solution**:
1. Check delete policy is enabled
2. Verify you're authenticated
3. Check console for API errors

### Upload is Slow

**Problem**: Large images take too long
**Solution**:
1. Resize images before upload (recommended: 1200x1200px)
2. Compress images using tools like TinyPNG
3. Convert to WebP format for better compression

## 📊 Storage Limits

### Free Tier (Supabase)
- **Storage**: 1GB total
- **Bandwidth**: 2GB per month
- **File uploads**: 50MB max size (we use 5MB)

### Recommended Practices
- Compress images before upload
- Use WebP format when possible
- Delete unused images regularly
- Monitor storage usage in dashboard

## 🔄 Migration from Mock Data

If you have existing costumes with placeholder image URLs:

1. Keep the existing URLs in the database
2. Upload real images through the admin panel
3. The new URLs will replace placeholders
4. Old URLs will be preserved in database history

## 📈 Advanced Features (Optional)

### Image Optimization
Consider adding:
- Automatic image resizing
- Format conversion (to WebP)
- Thumbnail generation
- CDN integration

### Enhanced Gallery
- Image reordering drag-and-drop
- Bulk upload
- Image cropping
- Alt text for SEO

## 🎉 You're Ready!

Your image upload system is now configured! Admin users can:
- ✅ Upload costume images
- ✅ Manage image galleries
- ✅ Delete unwanted images
- ✅ See image previews
- ✅ Track upload progress

Images will be stored securely in Supabase Storage and displayed throughout your costume rental website!

## 📞 Support

For storage-specific issues:
- Supabase Storage Docs: https://supabase.com/docs/guides/storage
- Check browser console for errors
- Verify policies in Supabase dashboard
- Review network tab for failed requests

