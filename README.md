# 🎭 Costume Rental Management System

A complete, production-ready costume rental platform with admin panel, Messenger integration, and Supabase backend.

## ✨ Features

### 🛍️ Customer Features
- **Browse Costumes**: Beautiful catalog with categories and search
- **Interactive Calendar**: Visual date selection with real-time availability
- **Flexible Pricing**: 12h, daily, 3-day, and weekly rental options
- **Messenger Booking**: Direct booking via Facebook Messenger with pre-filled details
- **Mobile Optimized**: Horizontal scrolling categories, responsive design
- **Philippine Peso**: Complete PHP currency support

### 👨‍💼 Admin Features
- **Dashboard**: Real-time statistics and insights
- **Order Management**: Track all bookings with status updates
- **Inventory Control**: Add, edit, delete costumes
- **Image Upload**: Drag-and-drop image management with Supabase Storage
- **Availability Management**: Calendar-based date blocking system
- **Analytics**: Revenue tracking and popular costume insights
- **Professional UI**: Sidebar navigation with mobile support

### 🔒 Advanced Features
- **Availability Blocking**: Prevent bookings during maintenance/repairs
- **Date Range Validation**: Automatic conflict prevention
- **Real-time Updates**: Supabase for instant synchronization
- **Image Management**: Upload up to 5 images per costume
- **Status Tracking**: Pending → Confirmed → Completed workflow

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase (5 minutes)

#### Create Project
1. Go to https://supabase.com
2. Create new project
3. Get your credentials from Settings → API

#### Configure Environment
Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Run Database Schema
In Supabase SQL Editor, run these files in order:
1. `supabase-schema.sql` - Main database
2. `supabase-storage-setup.sql` - Image storage  
3. `supabase-availability-schema.sql` - Availability management

### 3. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
costume-rental/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page
│   │   ├── costumes/                   # Costume catalog
│   │   ├── categories/                 # Category pages
│   │   ├── booking/                    # Booking form
│   │   ├── admin/                      # Admin dashboard
│   │   │   └── costumes/[id]/         # Availability management
│   │   └── api/                        # API routes
│   │       ├── costumes/              # Costume CRUD
│   │       ├── bookings/              # Booking CRUD
│   │       ├── availability/          # Availability management
│   │       ├── categories/            # Category API
│   │       └── upload/                # Image upload
│   ├── components/
│   │   ├── admin/
│   │   │   ├── admin-layout.tsx       # Admin sidebar
│   │   │   ├── availability-calendar.tsx  # Date blocking
│   │   │   ├── costume-form-modal.tsx # Add/edit costume
│   │   │   ├── order-detail-modal.tsx # Order details
│   │   │   └── image-upload.tsx       # Image management
│   │   ├── ui/                        # shadcn/ui components
│   │   ├── booking-form.tsx           # Messenger booking
│   │   ├── navigation.tsx             # Main navigation
│   │   └── footer.tsx                 # Footer
│   ├── lib/
│   │   ├── utils.ts                   # Utility functions
│   │   ├── supabase.ts                # Supabase client
│   │   └── test-supabase.ts           # Connection test
│   ├── data/
│   │   └── costumes.ts                # Mock data (fallback)
│   └── types/
│       └── index.ts                   # TypeScript types
├── public/                             # Static assets
├── supabase-schema.sql                 # Database schema
├── supabase-storage-setup.sql          # Storage setup
├── supabase-availability-schema.sql    # Availability system
└── Documentation/                      # Guides (see below)
```

## 📚 Documentation

### Setup Guides
- **QUICKSTART.md** - 5-minute setup guide
- **SUPABASE_SETUP.md** - Complete database setup
- **STORAGE_SETUP.md** - Image upload configuration
- **AVAILABILITY_MANAGEMENT.md** - Date blocking system

### User Guides
- **ADMIN_GUIDE.md** - Admin panel usage
- **IMAGE_UPLOAD_GUIDE.md** - Image management
- **ADMIN_AVAILABILITY_QUICKSTART.md** - Availability blocking
- **COMPLETE_INTEGRATION_GUIDE.md** - Full system integration

## 🎯 Key Pages

### Customer-Facing
- `/` - Home with featured categories and costumes
- `/costumes` - Full costume catalog with filters
- `/categories` - Browse by category
- `/costumes/[slug]` - Costume detail with booking calendar
- `/booking` - Booking form (redirects to Messenger)
- `/about` - About the business
- `/contact` - Contact information

### Admin Panel
- `/admin` - Dashboard overview
- `/admin` (Orders tab) - Order management
- `/admin` (Inventory tab) - Costume management
- `/admin` (Analytics tab) - Business insights
- `/admin/costumes/[id]` - Availability calendar

## 🗄️ Database Schema

### Tables
- **categories** - Costume categories (6 types)
- **costumes** - Inventory with pricing (10+ items)
- **bookings** - Customer orders and status
- **availability_blocks** - Admin-blocked date ranges

### Storage Buckets
- **costume-images** - Costume photos (public, 5MB limit)

## 🔧 API Endpoints

### Costumes
- `GET /api/costumes` - List all
- `POST /api/costumes` - Create
- `PUT /api/costumes/[id]` - Update
- `DELETE /api/costumes/[id]` - Delete

### Bookings
- `GET /api/bookings` - List all (with status filter)
- `POST /api/bookings` - Create
- `PATCH /api/bookings/[id]` - Update status
- `DELETE /api/bookings/[id]` - Delete

### Availability
- `GET /api/availability` - Get blocks for costume/month
- `POST /api/availability` - Block dates
- `DELETE /api/availability` - Remove block
- `GET /api/availability/check` - Check if dates available

### Images
- `POST /api/upload` - Upload image
- `DELETE /api/upload` - Delete image

### Categories
- `GET /api/categories` - List all categories

## 💻 Tech Stack

- **Framework**: Next.js 15 (App Router, React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Deployment**: Vercel (recommended)

## 🎨 Design Features

- Clean, modern interface
- Mobile-first responsive design
- Horizontal scrolling on mobile
- Professional admin panel
- Drag-and-drop image uploads
- Interactive calendars
- Real-time updates

## 🔐 Security

- Row Level Security (RLS) on all tables
- Authenticated admin operations
- Public read-only for customers
- Secure image uploads
- Environment variable protection
- Input validation

## 📱 Mobile Responsive

- Horizontal scrolling categories
- 2-column grid layouts on mobile
- Touch-friendly interfaces
- Collapsible navigation
- Optimized image sizes
- Fast loading times

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production
```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🛠️ Development

### Run Locally
```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Lint code
```

### Database Migrations
Run SQL files in Supabase SQL Editor:
1. Main schema
2. Storage setup
3. Availability schema

### Testing
- Admin: http://localhost:3000/admin
- Customer: http://localhost:3000
- API: http://localhost:3000/api/*

## 📊 Business Metrics

Track via admin dashboard:
- Total orders and revenue
- Pending vs. completed bookings
- Popular costumes
- Average rental duration
- Customer insights

## 🎉 What Makes This Special

✅ **Complete Solution**: Customer + Admin in one platform  
✅ **Production Ready**: Supabase backend, type-safe  
✅ **Messenger Integration**: Direct customer communication  
✅ **Smart Availability**: Admin blocks + automatic conflict prevention  
✅ **Professional UI**: Clean design, great UX  
✅ **Philippine Market**: PHP currency, local business focus  
✅ **Scalable**: Database-backed, handles growth  
✅ **Well Documented**: Comprehensive guides included  

## 📞 Support

For issues or questions:
1. Check relevant .md documentation files
2. Review browser console for errors
3. Verify Supabase setup is complete
4. Check API routes are responding

## 📄 License

This project is created for ForRentInflatablesph.

## 🙏 Acknowledgments

Built with:
- Next.js by Vercel
- Supabase for backend
- shadcn/ui for components
- Tailwind CSS for styling

---

**Ready to launch your costume rental business!** 🎭✨

For detailed setup instructions, start with `QUICKSTART.md`
