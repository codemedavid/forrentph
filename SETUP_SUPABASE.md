# 🚀 Supabase Setup Guide

## ⚠️ You're seeing errors because Supabase is not configured yet!

Follow these steps to fix the "Error fetching categories/costumes" errors:

---

## Step 1: Create `.env.local` File

Create a new file named `.env.local` in the `costume-rental` folder with this content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## Step 2: Get Your Supabase Credentials

### 2.1 Create a Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a **free account** (no credit card required)
3. Click **"New Project"**

### 2.2 Create a New Project
Fill in:
- **Name**: `costume-rental` (or any name you like)
- **Database Password**: Create a strong password (save this!)
- **Region**: Choose closest to your location
- **Plan**: Free tier is perfect

Click **"Create new project"** and wait ~2 minutes for setup to complete.

### 2.3 Copy Your API Credentials
1. In your Supabase dashboard, click **"Project Settings"** (gear icon)
2. Click **"API"** in the left sidebar
3. You'll see three values - copy each one:

**Project URL** (looks like: `https://xxxxx.supabase.co`)
- Copy this to `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`

**anon public key** (long string starting with `eyJhbGci...`)
- Copy this to `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

**service_role key** (another long string starting with `eyJhbGci...`)
- Copy this to `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- ⚠️ **Keep this secret!** Never commit to git or share publicly

Your `.env.local` should now look like:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...
```

---

## Step 3: Create Database Tables

1. In Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Open the file `supabase-schema.sql` in this project
4. **Copy all the contents** of that file
5. **Paste** into the Supabase SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)

You should see: ✅ Success. No rows returned

### Verify Tables Were Created
1. Click **"Table Editor"** in the left sidebar
2. You should see 3 tables:
   - ✅ `categories` (with 6 rows)
   - ✅ `costumes` (with 10 rows)
   - ✅ `bookings` (with 0 rows)

---

## Step 4: Restart Your App

1. **Stop your dev server** (press Ctrl+C in terminal)
2. **Restart it**:
   ```bash
   npm run dev
   ```
3. **Refresh your browser** at `http://localhost:3000`

---

## ✅ Success!

You should now see:
- ✅ Categories loading on homepage
- ✅ Costumes displaying properly
- ✅ No more console errors
- ✅ Admin panel works

---

## 🆘 Still Having Issues?

### Error: "Error fetching categories: {}"
- **Check**: Is `.env.local` created with all 3 values?
- **Check**: Are the values correct? (No typos, no extra spaces)
- **Check**: Did you restart the dev server after creating `.env.local`?

### Error: "relation does not exist"
- **Solution**: Run `supabase-schema.sql` in Supabase SQL Editor
- The database tables haven't been created yet

### Blank Page or No Data Showing
- **Check**: Open browser console (F12) for errors
- **Check**: Network tab shows API calls succeeding
- **Fallback**: The app should show mock data if Supabase fails

### Still Stuck?
1. Check Supabase project is **active** (not paused)
2. Verify API keys are from the **correct project**
3. Try creating a **new Supabase project** and start over

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- Project files:
  - `QUICKSTART.md` - Quick setup guide
  - `SUPABASE_SETUP.md` - Detailed Supabase guide
  - `ADMIN_GUIDE.md` - Using the admin panel

---

## 🔒 Security Note

**Never commit `.env.local` to git!**

The `.env.local` file is already in `.gitignore` and should stay private.
Your service role key has full database access - keep it secret!

---

## Next Steps

Once Supabase is configured:
1. ✅ Browse your website - see real data
2. ✅ Go to `/admin` - add your own costumes
3. ✅ Upload images (see `IMAGE_UPLOAD_GUIDE.md`)
4. ✅ Manage bookings and inventory

**Happy costume renting! 🎭**

