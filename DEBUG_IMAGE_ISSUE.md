# Debug Image Display Issue

## Problem
Images are showing as black screens instead of the actual costume images when editing.

## Debugging Steps

### Step 1: Check Console Logs
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Edit a costume in the admin panel
4. Look for these log messages:
   - `🖼️ ImageUpload: currentImages changed: [...]` - Shows what images are being passed
   - `✅ Image loaded successfully: [URL]` - Shows which images load successfully
   - `❌ Image failed to load: [URL]` - Shows which images fail to load

### Step 2: Check Image URLs
The console will show you the actual image URLs. Check if they are:

**Expected Cloudinary URLs:**
```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567/costumes/filename.jpg
```

**Problem Mock Data URLs:**
```
/images/costumes/inflatable-trex-1.jpg
```

### Step 3: Test Image URLs Directly
1. Copy the image URL from the console
2. Paste it directly in your browser's address bar
3. See if the image loads

### Step 4: Check Network Tab
1. In Developer Tools, go to Network tab
2. Edit a costume
3. Look for failed image requests (red entries)
4. Check the status codes (404, 403, CORS errors, etc.)

## Common Issues & Solutions

### Issue 1: Mock Data with Local Paths
**Problem**: Using mock data with `/images/costumes/...` paths that don't exist
**Solution**: Either:
- Add the actual image files to `/public/images/costumes/`
- Or use real Cloudinary URLs in mock data
- Or test with real database data

### Issue 2: Invalid Cloudinary URLs
**Problem**: Cloudinary URLs are malformed or expired
**Solution**: Check Cloudinary dashboard for correct URLs

### Issue 3: CORS Issues
**Problem**: Images blocked by CORS policy
**Solution**: Check Cloudinary CORS settings

### Issue 4: Database Not Connected
**Problem**: Using mock data instead of real database
**Solution**: Ensure Supabase is properly configured

## Quick Fix for Testing

If you want to test with real images immediately, you can:

1. **Upload a test image** through the form
2. **Use the Cloudinary URLs** that get generated
3. **Replace mock data** with real Cloudinary URLs

## Expected Behavior After Fix

✅ **When editing a costume with real Cloudinary images:**
- Images should display properly
- Console should show "Image loaded successfully"
- No black screens

✅ **When editing a costume with invalid URLs:**
- Console should show "Image failed to load"
- Should show a gray placeholder with "Image not found"
- Should show the problematic URL for debugging

## Next Steps

1. Run the debugging steps above
2. Check the console logs
3. Share the console output if you need help
4. The improved error handling will help identify the exact issue

## Files Modified
- `src/components/admin/image-upload.tsx` - Added better error handling and debugging
