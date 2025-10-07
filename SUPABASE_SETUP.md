# Supabase Setup Guide for Costume Rental Admin

This guide will walk you through setting up Supabase as the database backend for your costume rental application.

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- Your Next.js application

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the following:
   - **Name**: Costume Rental
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is fine for development
4. Click "Create new project"
5. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your API Credentials

1. Go to **Project Settings** → **API**
2. Find these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGci...` (long string)
   - **service_role key**: `eyJhbGci...` (another long string - keep this secret!)

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in the root of your project:

```bash
# In: costume-rental/.env.local

NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

2. Replace the placeholder values with your actual credentials from Step 2

**Important**: Never commit `.env.local` to version control!

## Step 4: Set Up the Database Schema

1. Go to your Supabase project
2. Click on **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `supabase-schema.sql` file
5. Click **Run** to execute the SQL

This will create:
- ✅ `categories` table
- ✅ `costumes` table  
- ✅ `bookings` table
- ✅ Indexes for better performance
- ✅ Row Level Security policies
- ✅ Automatic timestamp updates
- ✅ Sample data for testing

## Step 5: Verify the Database

1. Click **Table Editor** in the sidebar
2. You should see three tables:
   - `categories` - Should have 6 categories
   - `costumes` - Should have 10 costumes
   - `bookings` - Empty (no bookings yet)

## Step 6: Test the Connection

1. Restart your development server:
```bash
npm run dev
```

2. Navigate to `/admin` in your browser
3. The admin panel should now load data from Supabase!

## Step 7: Understanding the API Routes

Your application now has these API endpoints:

### Costumes
- `GET /api/costumes` - Get all costumes
- `POST /api/costumes` - Create new costume
- `GET /api/costumes/[id]` - Get single costume
- `PUT /api/costumes/[id]` - Update costume
- `DELETE /api/costumes/[id]` - Delete costume

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings?status=pending` - Filter by status
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/[id]` - Get single booking
- `PATCH /api/bookings/[id]` - Update booking status
- `PUT /api/bookings/[id]` - Full update booking
- `DELETE /api/bookings/[id]` - Delete booking

## Step 8: Enable Realtime (Optional)

For real-time updates when bookings come in:

1. Go to **Database** → **Replication**
2. Enable replication for the `bookings` table
3. Click **Save**

## Security Best Practices

### Row Level Security (RLS)
Your database is already configured with RLS policies:
- ✅ Public can read all data (for customer browsing)
- ✅ Only authenticated users can write (for admin operations)

### API Keys
- **anon key**: Safe to expose in client-side code
- **service_role key**: NEVER expose! Only use server-side

### Environment Variables
- Never commit `.env.local` to git
- Use different projects for development and production
- Rotate keys if compromised

## Troubleshooting

### "Failed to fetch data"
- Check that environment variables are set correctly
- Verify Supabase project is running
- Check browser console for errors

### "Unauthorized" errors
- Ensure RLS policies are properly configured
- Check that API keys are correct
- Verify user authentication if implemented

### "Table doesn't exist"
- Run the SQL schema again
- Check Table Editor to verify tables exist
- Ensure you're connected to the correct project

## Next Steps

1. **Add Authentication**: Implement Supabase Auth for admin login
2. **Add Realtime**: Subscribe to booking changes for instant updates
3. **Add Storage**: Use Supabase Storage for costume images
4. **Add Email**: Configure email templates for booking confirmations

## Database Structure

### Categories Table
```sql
- id (UUID, primary key)
- name (text)
- description (text)
- image (text)
- slug (text, unique)
- created_at (timestamp)
- updated_at (timestamp)
```

### Costumes Table
```sql
- id (UUID, primary key)
- name (text)
- description (text)
- category_id (UUID, foreign key)
- images (text array)
- price_per_day (numeric)
- price_per_12_hours (numeric)
- price_per_week (numeric)
- size (text)
- difficulty (text)
- setup_time (integer)
- features (text array)
- is_available (boolean)
- slug (text, unique)
- created_at (timestamp)
- updated_at (timestamp)
```

### Bookings Table
```sql
- id (UUID, primary key)
- costume_id (UUID, foreign key)
- customer_name (text)
- customer_email (text)
- customer_phone (text)
- start_date (timestamp)
- end_date (timestamp)
- total_price (numeric)
- status (text: pending/confirmed/completed/cancelled)
- special_requests (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

## Support

For Supabase-specific issues:
- Documentation: https://supabase.com/docs
- Community: https://github.com/supabase/supabase/discussions
- Discord: https://discord.supabase.com

For application issues:
- Check the admin panel console for errors
- Verify API routes are responding correctly
- Review the SUPABASE_SETUP.md guide

