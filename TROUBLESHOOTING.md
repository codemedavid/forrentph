# Troubleshooting Guide

## 🐛 Common Issues and Solutions

### Issue: Costumes Added in Admin Don't Show on Website

#### Problem
You add a costume in the admin panel, but when you visit `/costumes/{slug}`, it doesn't appear or shows "Costume Not Found".

#### ✅ Solution
The costume detail pages now fetch from Supabase! The fix has been applied.

**What was fixed:**
1. Created `/api/costumes/slug/[slug]` endpoint for fetching by slug
2. Updated costume detail page to use API instead of mock data
3. Added proper fallback to mock data if Supabase isn't configured
4. Added logging for debugging

**How to verify it works:**
```bash
# Test the API
curl "http://localhost:3001/api/costumes/slug/your-costume-slug"

# Should return:
{
  "costume": {
    "id": "...",
    "name": "Your Costume",
    "slug": "your-costume-slug",
    ...
  }
}
```

### Issue: "Supabase not configured" Messages

#### Problem
API routes return empty arrays or error messages about Supabase not being configured.

#### ✅ Solution
1. Create `.env.local` file in project root
2. Add your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```
3. Restart the dev server:
```bash
npm run dev
```

### Issue: Images Don't Upload

#### Problem
Clicking upload or dragging images doesn't work.

#### ✅ Solutions

**Check 1: Storage Bucket Exists**
1. Go to Supabase → Storage
2. Verify `costume-images` bucket exists
3. Check it's set to "Public"

**Check 2: Policies Are Set**
1. Run `supabase-storage-setup.sql` in SQL Editor
2. Verify policies exist in Storage → Policies

**Check 3: File Size**
- Maximum 5MB per image
- Try with a smaller image

**Check 4: File Format**
- Only JPG, PNG, WebP, GIF allowed
- Check file extension

### Issue: Blocked Dates Don't Work

#### Problem
Admin blocks dates, but customers can still book them.

#### ✅ Solution
1. Run `supabase-availability-schema.sql` in Supabase SQL Editor
2. Restart dev server
3. Clear browser cache
4. Test blocking again

**Verify the table exists:**
```sql
SELECT * FROM availability_blocks LIMIT 1;
```

### Issue: Calendar Not Loading

#### Problem
Calendar component shows spinner forever or blank screen.

#### ✅ Solutions

**Check 1: Console Errors**
- Open browser DevTools (F12)
- Check Console tab for errors
- Look for API errors or missing data

**Check 2: API Response**
```bash
# Test the availability API
curl "http://localhost:3001/api/availability?costumeId=YOUR_ID&year=2024&month=1"
```

**Check 3: Date Functions**
- Ensure `date-fns` is installed
- Check imports are correct

### Issue: Categories Page Shows Wrong Data

#### Problem
Categories page doesn't show costumes added via admin.

#### ✅ Solution
The categories pages now fetch from Supabase!

**Verify:**
```bash
# Check API returns your data
curl "http://localhost:3001/api/costumes"
curl "http://localhost:3001/api/categories"
```

### Issue: Dev Server Won't Start

#### Problem
`npm run dev` fails or shows errors.

#### ✅ Solutions

**Solution 1: Clean Install**
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

**Solution 2: Check Port**
```bash
# If port 3000 is busy, use different port
PORT=3001 npm run dev
```

**Solution 3: Check Node Version**
```bash
node --version  # Should be 18.17+ or 20+
```

### Issue: Build Fails

#### Problem
`npm run build` shows TypeScript or ESLint errors.

#### ✅ Solutions

**Fix TypeScript Errors:**
- Check all `any` types are documented
- Verify imports are correct
- Run `npx tsc --noEmit` to see errors

**Fix ESLint Errors:**
- Escape apostrophes: `you're` → `you&apos;re`
- Remove unused imports
- Fix const vs let declarations

### Issue: Data Doesn't Sync

#### Problem
Admin changes don't appear on customer pages.

#### ✅ Solutions

**Solution 1: Clear Cache**
```bash
# In browser DevTools
Application → Clear Storage → Clear site data
```

**Solution 2: Force Refresh**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or add `cache: 'no-store'` to fetch calls

**Solution 3: Check Database**
```sql
-- In Supabase SQL Editor
SELECT * FROM costumes WHERE slug = 'your-slug';
```

### Issue: Messenger Link Doesn't Work

#### Problem
Clicking "Send to Messenger" doesn't open Messenger.

#### ✅ Solutions

**Check 1: URL Format**
- Verify Facebook page username is correct
- Should be: `ForRentInflatablesph`

**Check 2: Pop-up Blocked**
- Allow pop-ups for localhost
- Check browser console for blocked pop-up message

**Check 3: Test URL**
```
https://m.me/ForRentInflatablesph?text=Test
```

### Issue: Admin Panel Shows No Data

#### Problem
Admin dashboard is empty or shows zero orders/costumes.

#### ✅ Solutions

**Check 1: Database Has Data**
```sql
-- In Supabase
SELECT COUNT(*) FROM costumes;
SELECT COUNT(*) FROM bookings;
SELECT COUNT(*) FROM categories;
```

**Check 2: Run Init SQL**
Run `supabase-schema.sql` to add sample data

**Check 3: API Working**
```bash
curl "http://localhost:3001/api/costumes"
curl "http://localhost:3001/api/bookings"
```

## 🔍 Debugging Tips

### Enable Detailed Logging

**In Browser Console:**
```javascript
// Set to see all API calls
localStorage.setItem('debug', 'true');
```

**In API Routes:**
Add console.logs to track flow:
```typescript
console.log('📥 Request received:', body);
console.log('📤 Response:', data);
console.log('❌ Error:', error);
```

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for failed requests (red)
5. Click on request to see details

### Verify Database Connection

**Test Supabase:**
```typescript
// In browser console
await fetch('/api/costumes').then(r => r.json())
```

Should return array of costumes, not error.

## 📊 Health Check Checklist

Run through this list when things aren't working:

- [ ] `.env.local` file exists with correct credentials
- [ ] Dev server is running (`npm run dev`)
- [ ] Supabase project is active
- [ ] All SQL schemas have been run
- [ ] Storage bucket `costume-images` exists
- [ ] Browser console shows no errors
- [ ] API endpoints return data (test with curl)
- [ ] Network tab shows successful requests
- [ ] Database tables have data

## 🆘 Still Having Issues?

### Step-by-Step Debug Process

1. **Check Environment**
   ```bash
   # Verify env vars are loaded
   echo $NEXT_PUBLIC_SUPABASE_URL
   ```

2. **Test API Directly**
   ```bash
   curl "http://localhost:3001/api/costumes"
   ```

3. **Check Browser Console**
   - F12 → Console tab
   - Look for red errors
   - Check API call responses

4. **Verify Database**
   - Open Supabase dashboard
   - Check Table Editor
   - Run simple query

5. **Check Logs**
   - Terminal running `npm run dev`
   - Look for error messages
   - Check API route logs

## 📞 Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| "Not found" | Check slug matches database exactly |
| "Empty data" | Run SQL schema files |
| "Upload fails" | Check storage bucket exists |
| "Can't block dates" | Run availability schema SQL |
| "Slow loading" | Check network connection |
| "Build errors" | Fix TypeScript/ESLint issues |

## ✅ Verification Commands

```bash
# Check if API is running
curl http://localhost:3001/api/costumes

# Check specific costume
curl http://localhost:3001/api/costumes/slug/check-this

# Check categories
curl http://localhost:3001/api/categories

# Check bookings
curl http://localhost:3001/api/bookings

# Check availability
curl "http://localhost:3001/api/availability?costumeId=YOUR_ID&year=2024&month=1"
```

---

**Most issues are solved by:**
1. Running all SQL schema files
2. Restarting dev server
3. Clearing browser cache
4. Checking console for errors

For persistent issues, check the specific guides:
- `SUPABASE_SETUP.md` - Database issues
- `STORAGE_SETUP.md` - Image upload issues
- `AVAILABILITY_MANAGEMENT.md` - Calendar issues
