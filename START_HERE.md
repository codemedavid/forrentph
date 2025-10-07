# 🎯 START HERE - Fix the Errors

## ⚠️ You're seeing errors? Here's why:

Your app is trying to connect to Supabase (database), but it's not configured yet.

**Good news:** The app still works! It's using mock/demo data for now.

---

## 🚀 Quick Fix (2 minutes)

### Step 1: Create `.env.local` file

In the `costume-rental` folder, create a file named `.env.local` and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_secret_here
```

### Step 2: Get your Supabase credentials

1. Go to **https://supabase.com** → Sign up (free)
2. Create a new project (takes 2 min)
3. Go to **Settings** → **API**
4. Copy the 3 values into your `.env.local`

### Step 3: Set up database

1. In Supabase, go to **SQL Editor**
2. Copy contents of `supabase-schema.sql`
3. Paste and click **Run**

### Step 4: Restart

```bash
# Stop server (Ctrl+C)
npm run dev
```

**Done!** Errors should be gone.

---

## 📚 Need More Help?

- **Detailed guide:** Open `SETUP_SUPABASE.md`
- **Quick start:** Open `QUICKSTART.md`
- **Admin help:** Open `ADMIN_GUIDE.md`

---

## 💡 Can I skip Supabase for now?

**Yes!** The app works without it. You'll see:
- ✅ Mock costumes and categories
- ✅ All pages work
- ✅ Admin panel displays data
- ❌ Can't save new costumes to database
- ❌ Changes don't persist

To use the full app with database, follow the steps above.

---

## Console Messages Explained

### What you're seeing:
```
⚠️ Supabase not configured. Using mock data.
```

**This is normal!** It means the app detected no `.env.local` file and switched to demo mode automatically.

### After setup, you'll see:
```
✅ Connected to Supabase
✅ 6 categories loaded
✅ 10 costumes loaded
```

---

## 🎉 Next Steps

Once Supabase is configured:

1. **Browse your site** - See real database data
2. **Go to `/admin`** - Add your own costumes  
3. **Upload images** - Make it look professional
4. **Customize** - Update categories, pricing, etc.

**Ready to start?** Follow the 4 steps above! 👆

