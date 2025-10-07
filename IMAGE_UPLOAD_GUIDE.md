# Image Upload Feature - Quick Start

## ✨ What's New

Your costume rental app now has a complete image upload system!

### Features
- 📸 **Upload Multiple Images** - Up to 5 images per costume
- 🖱️ **Drag & Drop** - Drag images directly from your computer  
- 👁️ **Live Preview** - See images immediately after upload
- 🗑️ **Easy Delete** - Remove unwanted images with one click
- 🎯 **Primary Image** - First image is automatically the main one
- ✅ **File Validation** - Automatic checking of size and format

## 🚀 3-Minute Setup

### Step 1: Create Storage Bucket (1 minute)

1. Open your Supabase project: https://supabase.com/dashboard
2. Click **Storage** in the left sidebar
3. Click **New bucket** button
4. Enter these details:
   ```
   Name: costume-images
   Public: ✅ (checked)
   ```
5. Click **Create bucket**

### Step 2: Run SQL Script (1 minute)

1. Click **SQL Editor** in the sidebar
2. Click **New query**
3. Open the file `supabase-storage-setup.sql` in your project
4. Copy ALL the SQL code
5. Paste into the SQL Editor
6. Click **Run** (bottom right)
7. Wait for "Success" message

### Step 3: Test It! (1 minute)

1. Make sure your app is running:
   ```bash
   npm run dev
   ```
2. Go to http://localhost:3000/admin
3. Click **Add New Costume**
4. Scroll to the top - you'll see "Costume Images"
5. Click or drag an image to upload
6. Done! 🎉

## 📱 How to Use

### For Admins

#### Adding Images to a New Costume
1. Go to Admin Panel → Click "Add New Costume"
2. **First**: Upload images (1-5 images)
3. **Then**: Fill in costume details
4. Click "Create Costume"

#### Adding Images to Existing Costume
1. Go to Admin Panel → Inventory tab
2. Find the costume → Click "Edit"
3. Scroll to "Costume Images" section
4. Upload new images or delete existing ones
5. Click "Update Costume"

#### Upload Methods

**Method A: Click to Upload**
- Click the upload area
- Select one or more images
- Click Open

**Method B: Drag & Drop**
- Open folder with images
- Drag images into the upload area
- Release to upload

### Image Management

#### View All Images
- Images appear in a grid below the upload area
- First image has a "Primary" badge
- Hover over images to see delete button

#### Delete an Image
1. Hover over the image
2. Click the red X button that appears
3. Confirm if prompted
4. Image is removed instantly

#### Change Primary Image
The first (leftmost) image is always the primary one.

To change it:
1. Delete the current first image
2. Upload your preferred image first
3. Or delete all and re-upload in desired order

## 📋 Image Requirements

### Accepted Formats
- ✅ JPG / JPEG
- ✅ PNG
- ✅ WebP (recommended for smaller file size)
- ✅ GIF

### Size Limits
- **Maximum file size**: 5MB per image
- **Recommended dimensions**: 800x800px or larger
- **Aspect ratio**: Square (1:1) works best

### Optimization Tips
1. **Resize large images** before upload
   - Use free tools like TinyPNG.com
   - Recommended: 1200x1200px maximum
   
2. **Convert to WebP** for better compression
   - Smaller file sizes
   - Faster loading
   - Better quality

3. **Use good lighting** and clear backgrounds
   - Makes costumes look more appealing
   - Customers can see details better

## 🎯 Best Practices

### Number of Images
- **Minimum**: 1 image (required)
- **Recommended**: 3-5 images
- **Maximum**: 5 images

### Image Order
1. **First image**: Main costume photo (full view)
2. **Second image**: Close-up of details
3. **Third image**: Costume being worn (if possible)
4. **Fourth image**: Accessories or features
5. **Fifth image**: Size/scale reference

### Photo Tips
- ✅ Use natural lighting or good studio lights
- ✅ Plain background (white/neutral)
- ✅ Multiple angles
- ✅ Show all included pieces
- ❌ Avoid blurry or dark images
- ❌ Don't use watermarks
- ❌ Skip low-resolution images

## 🔒 Security & Storage

### Who Can Upload?
- Only authenticated admin users
- Public users cannot upload images
- All uploads are logged

### Where Are Images Stored?
- Supabase Storage bucket: `costume-images`
- Each image gets a unique filename
- Public URLs for easy access

### Storage Limits
- **Free tier**: 1GB total storage
- **Bandwidth**: 2GB/month transfers
- Monitor usage in Supabase dashboard

## ❓ Troubleshooting

### "Upload Failed" Error

**Problem**: Image won't upload
**Fixes**:
1. Check file size (must be under 5MB)
2. Verify file format (JPG, PNG, WebP, GIF only)
3. Try a different image
4. Check internet connection
5. Refresh the page

### Images Not Showing

**Problem**: Uploaded images don't display
**Fixes**:
1. Verify bucket is set to "Public" in Supabase
2. Check browser console for errors
3. Wait a few seconds and refresh
4. Verify image URL in database

### "Permission Denied" Error

**Problem**: Can't upload or delete
**Fixes**:
1. Verify storage policies are set up
2. Run `supabase-storage-setup.sql` again
3. Check you're logged in as admin
4. Clear browser cache

### Upload Is Slow

**Problem**: Takes too long to upload
**Solutions**:
1. Compress image before uploading
2. Reduce image dimensions
3. Check internet speed
4. Upload one image at a time

## 📊 Technical Details

### File Naming
Images are automatically renamed:
```
Original: my-costume.jpg
Stored as: a1b2c3-1699999999999.jpg
```

Format: `{random-id}-{timestamp}.{extension}`

### Storage Structure
```
supabase/storage/costume-images/
├── abc123-1699999999991.jpg
├── def456-1699999999992.png
├── ghi789-1699999999993.webp
└── ...
```

### Database Storage
Image URLs are stored in the `costumes` table:
```sql
images: text[] -- Array of public URLs
```

Example:
```json
[
  "https://...supabase.co/storage/v1/object/public/costume-images/abc123.jpg",
  "https://...supabase.co/storage/v1/object/public/costume-images/def456.jpg"
]
```

## 🎨 For Developers

### Component Usage
```typescript
import { ImageUpload } from '@/components/admin/image-upload';

<ImageUpload
  currentImages={costume.images}
  onImagesChange={(urls) => handleImageUpdate(urls)}
  maxImages={5}
/>
```

### API Endpoints
- **Upload**: `POST /api/upload`
- **Delete**: `DELETE /api/upload?path={filename}`

### Supabase Client
```typescript
import { supabase } from '@/lib/supabase';

// Upload
const { data } = await supabase.storage
  .from('costume-images')
  .upload(filename, file);

// Delete
await supabase.storage
  .from('costume-images')
  .remove([filename]);
```

## 🎉 Success!

Your image upload system is ready! Admins can now:
- Upload professional costume photos
- Manage image galleries
- Create visually appealing listings
- Improve customer experience

For detailed technical information, see:
- `STORAGE_SETUP.md` - Complete setup guide
- `supabase-storage-setup.sql` - SQL script
- `src/components/admin/image-upload.tsx` - Component code

Happy uploading! 📸✨

