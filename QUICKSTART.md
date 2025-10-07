# Costume Rental App - Quick Start Guide

## 🚀 Complete Setup in 5 Minutes

### 1. Install Dependencies
```bash
cd costume-rental
npm install
```

### 2. Set Up Supabase Database

#### Option A: Quick Setup (Recommended)
1. Go to https://supabase.com and create a free account
2. Create a new project (takes ~2 minutes)
3. Copy your credentials from **Settings** → **API**
4. Create `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

5. Run the database setup:
   - Open Supabase **SQL Editor**
   - Copy contents from `supabase-schema.sql`
   - Click **Run**

#### Option B: Use Mock Data (Development Only)
If you want to test without Supabase first:
- Skip the .env.local setup
- The app will use the mock data from `/src/data/costumes.ts`

### 3. Run the Application
```bash
npm run dev
```

Visit http://localhost:3000

### 4. Access Admin Panel
Click "Admin" in the navigation or visit http://localhost:3000/admin

## 📱 Features Overview

### Customer-Facing
- ✅ Browse costume categories
- ✅ View costume details with pricing
- ✅ Select rental dates
- ✅ Book via Facebook Messenger
- ✅ Philippine Peso (₱) pricing
- ✅ Mobile-responsive design
- ✅ Horizontal scrolling categories on mobile

### Admin Panel
- ✅ Dashboard with statistics
- ✅ Order management (view, filter, update status)
- ✅ Inventory management (add, edit, delete costumes)
- ✅ Analytics and insights
- ✅ Real-time updates (with Supabase)
- ✅ Professional sidebar layout

### Messenger Integration
- ✅ Pre-filled booking messages
- ✅ Direct link to Facebook page
- ✅ All booking details included

## 🗄️ Database Structure

Once Supabase is set up, you'll have:
- **Categories**: 6 costume categories
- **Costumes**: 10 sample costumes with pricing
- **Bookings**: Order tracking system

## 📝 Key Pages

- `/` - Home page with featured costumes
- `/costumes` - All costumes catalog
- `/categories` - Browse by category
- `/categories/[slug]` - Category detail page
- `/costumes/[slug]` - Costume detail with booking
- `/booking` - Booking form with summary
- `/admin` - Admin dashboard
- `/contact` - Contact information
- `/about` - About the business

## 🔧 Environment Variables

Required for Supabase integration:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_secret_key
```

## 📚 Documentation

- `SUPABASE_SETUP.md` - Detailed Supabase configuration
- `ADMIN_GUIDE.md` - Admin panel usage guide
- `supabase-schema.sql` - Database schema
- `README.md` - Project overview

## 🛠️ API Endpoints

### Costumes
- `GET /api/costumes` - List all
- `POST /api/costumes` - Create new
- `PUT /api/costumes/[id]` - Update
- `DELETE /api/costumes/[id]` - Delete

### Bookings
- `GET /api/bookings` - List all (with filtering)
- `POST /api/bookings` - Create new
- `PATCH /api/bookings/[id]` - Update status
- `PUT /api/bookings/[id]` - Full update
- `DELETE /api/bookings/[id]` - Delete

## 🎨 Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React, TailwindCSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom theme
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Type Safety**: TypeScript

## 🌟 Next Steps

1. **Customize Your Data**
   - Add your own costume images
   - Update pricing to match your business
   - Add more categories

2. **Set Up Facebook Page**
   - Update Messenger URL in `utils.ts`
   - Test the booking flow

3. **Deploy**
   - Deploy to Vercel (recommended)
   - Set environment variables in hosting platform
   - Connect custom domain

4. **Enhance Features**
   - Add authentication for admin
   - Implement email notifications
   - Add payment processing
   - Set up automated reminders

## 🆘 Troubleshooting

### App won't start
```bash
rm -rf node_modules
npm install
npm run dev
```

### Supabase connection errors
- Check `.env.local` file exists
- Verify credentials are correct
- Ensure Supabase project is running

### Database errors
- Run `supabase-schema.sql` again
- Check table names match code
- Verify RLS policies are enabled

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review console errors
3. Verify Supabase setup is complete
4. Check API routes are responding

## 🎉 You're Ready!

Your costume rental application is now set up and ready to use. Start by exploring the admin panel and customizing the costumes to match your inventory!

