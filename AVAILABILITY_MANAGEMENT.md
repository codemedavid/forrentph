# Costume Availability Management Guide

## 📅 Overview

The availability management system allows admins to block specific dates when costumes cannot be rented. This prevents customer bookings during maintenance, repairs, or other periods when costumes are unavailable.

## ✨ Features

### For Admins
- ✅ **Visual Calendar**: Interactive monthly calendar view
- ✅ **Date Blocking**: Click dates to mark them as unavailable
- ✅ **Date Range Selection**: Select multiple dates at once
- ✅ **Reason Tracking**: Add notes for why dates are blocked
- ✅ **Quick Unblock**: Remove blocks with one click
- ✅ **Block List**: View all active availability blocks
- ✅ **Booking View**: See existing bookings on the calendar

### For Customers
- ✅ **Automatic Blocking**: Blocked dates appear as unavailable
- ✅ **Real-time Updates**: Availability updates immediately
- ✅ **Clear Feedback**: Visual indicators show unavailable dates
- ✅ **Booking Prevention**: Can't book blocked dates

## 🚀 Setup

### Step 1: Run the SQL Schema

1. Open your Supabase project
2. Go to **SQL Editor**
3. Open the file `supabase-availability-schema.sql`
4. Copy all SQL code
5. Paste into SQL Editor
6. Click **Run**

This creates:
- `availability_blocks` table
- Helper functions for checking availability
- RLS policies for security
- Indexes for performance

### Step 2: Verify Tables

1. Go to **Table Editor** in Supabase
2. Check that `availability_blocks` table exists
3. Verify it has these columns:
   - id, costume_id, start_date, end_date, reason, created_by, created_at, updated_at

### Step 3: Test the Feature

1. Start your app: `npm run dev`
2. Go to `/admin`
3. Click on **Inventory** tab
4. Click **Manage Availability** on any costume
5. Try blocking some dates!

## 📱 How to Use

### Accessing the Availability Manager

**From Admin Dashboard:**
1. Go to `/admin`
2. Click **Inventory** tab
3. Find the costume you want to manage
4. Click **Manage Availability** button

**Direct URL:**
- `/admin/costumes/[costume-id]`

### Blocking Dates

#### Method 1: Single Date
1. Click on a date in the calendar
2. The date turns blue (selected)
3. Click **Block Dates** button
4. Date is now blocked (shows in red)

#### Method 2: Multiple Dates
1. Click multiple dates in the calendar
2. All selected dates turn blue
3. Optionally click **Add Reason** to explain why
4. Click **Block Dates** button
5. All dates are blocked at once

#### Method 3: Date Range
1. Click the first date of your range
2. Click additional dates to extend the range
3. Add a reason if needed
4. Click **Block Dates**

### Adding Reasons

1. Select dates you want to block
2. Click **Add Reason (Optional)**
3. Enter reason (e.g., "Cleaning", "Repair", "Reserved")
4. Click **Block Dates**

### Unblocking Dates

**From Calendar:**
1. See all blocked date ranges listed below calendar
2. Find the block you want to remove
3. Click the **Remove** button
4. Block is deleted immediately

### Calendar Color Guide

- 🔵 **Blue**: Currently selected (about to block)
- 🔴 **Red**: Manually blocked by admin
- 🟡 **Yellow**: Booked by customer
- ⚪ **White**: Available for booking
- ⚫ **Gray**: Past dates (can't modify)

## 🎯 Use Cases

### Common Scenarios

#### Costume Maintenance
```
Dates: Jan 15-17
Reason: "Cleaning and repairs"
Action: Block dates → costume unavailable for 3 days
```

#### Reserved for Event
```
Dates: Feb 20
Reason: "Reserved for corporate event"
Action: Block date → costume held for specific customer
```

#### Seasonal Closure
```
Dates: Dec 24-26
Reason: "Holiday closure"
Action: Block dates → no bookings during holidays
```

#### Damage Repair
```
Dates: Mar 10-15
Reason: "Repair - torn seam"
Action: Block dates → costume out of service
```

## 💡 Best Practices

### When to Block Dates

✅ **Maintenance Period**: Regular cleaning and upkeep  
✅ **Repair Time**: Fixing damage or wear  
✅ **Special Reservations**: VIP or corporate bookings  
✅ **Business Closures**: Holidays, vacations  
✅ **Inventory Rotation**: Resting heavily-used items  

### Adding Helpful Reasons

Good examples:
- ✅ "Deep cleaning"
- ✅ "Repair - zipper replacement"
- ✅ "Reserved for ABC Corp event"
- ✅ "Holiday closure"

Less helpful:
- ❌ "Blocked"
- ❌ "N/A"
- ❌ (no reason)

### Managing Blocks Efficiently

1. **Review Regularly**: Check and remove old blocks
2. **Plan Ahead**: Block dates in advance
3. **Update Status**: Remove blocks when maintenance is done
4. **Use Reasons**: Help track why dates were blocked

## 🔍 Technical Details

### Database Schema

```sql
availability_blocks
├── id (UUID)
├── costume_id (UUID → costumes.id)
├── start_date (DATE)
├── end_date (DATE)
├── reason (TEXT, nullable)
├── created_by (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### API Endpoints

#### Get Blocked Dates
```
GET /api/availability?costumeId={id}&year={year}&month={month}
Response: { blockedDates: [...] }
```

#### Get All Blocks
```
GET /api/availability?costumeId={id}
Response: { blocks: [...] }
```

#### Create Block
```
POST /api/availability
Body: {
  costumeId: string,
  startDate: string,
  endDate: string,
  reason?: string
}
Response: { block: {...} }
```

#### Delete Block
```
DELETE /api/availability?id={blockId}
Response: { message: "Success" }
```

#### Check Availability
```
GET /api/availability/check?costumeId={id}&startDate={date}&endDate={date}
Response: {
  isAvailable: boolean,
  blockedDates: string[]
}
```

### Database Functions

#### check_costume_availability()
Checks if a costume is available for a date range.

```sql
SELECT * FROM check_costume_availability(
  'costume-uuid',
  '2024-01-15',
  '2024-01-17'
);
```

Returns:
- `is_available`: boolean
- `blocked_dates`: array of blocked dates

#### get_blocked_dates_for_month()
Gets all blocked dates for a month.

```sql
SELECT * FROM get_blocked_dates_for_month(
  'costume-uuid',
  2024,
  1
);
```

Returns:
- `blocked_date`: date
- `reason`: why it's blocked
- `block_type`: 'manual_block' or 'booking'

## 🔒 Security

### Access Control
- **Public**: Can view blocked dates
- **Admin Only**: Can create/delete blocks
- **RLS Policies**: Protect data integrity

### Validation
- End date must be >= start date
- Dates must be valid
- Costume must exist

## 🎨 UI Components

### AvailabilityCalendar
Location: `src/components/admin/availability-calendar.tsx`

Features:
- Monthly view navigation
- Click-to-select dates
- Visual status indicators
- Reason input
- Active blocks list
- Real-time updates

Usage:
```typescript
import { AvailabilityCalendar } from '@/components/admin/availability-calendar';

<AvailabilityCalendar
  costumeId="uuid"
  costumeName="Inflatable T-Rex"
/>
```

### Admin Costume Detail Page
Location: `src/app/admin/costumes/[id]/page.tsx`

Shows:
- Costume information
- Image gallery
- Pricing details
- Availability calendar
- Active blocks list

## 🔄 Integration Flow

### Customer Booking Flow
1. Customer selects costume
2. Chooses dates on costume detail page
3. System checks availability via API
4. Blocked dates appear as unavailable
5. Customer can only book available dates

### Admin Blocking Flow
1. Admin opens costume availability page
2. Selects dates to block
3. Adds optional reason
4. Clicks "Block Dates"
5. Dates immediately unavailable to customers

### Booking Integration
- Confirmed/pending bookings automatically show on calendar
- Can't create overlapping blocks
- Can't book blocked dates
- Real-time synchronization

## 📊 Reporting

### View Availability History
All blocks are tracked with:
- Creation timestamp
- Creator information
- Reason for blocking
- Date range

### Export Data
Use the admin dashboard to:
- View all active blocks
- Export booking and availability data
- Generate reports

## ❓ Troubleshooting

### Calendar Not Loading

**Problem**: Availability calendar doesn't appear  
**Solution**:
1. Run `supabase-availability-schema.sql`
2. Check console for errors
3. Verify costume ID is valid
4. Refresh the page

### Can't Block Dates

**Problem**: Block button doesn't work  
**Solution**:
1. Check you're authenticated as admin
2. Verify RLS policies are set up
3. Check selected dates are in the future
4. Review browser console for errors

### Dates Still Bookable

**Problem**: Blocked dates appear available to customers  
**Solution**:
1. Check availability_blocks table has data
2. Verify check_costume_availability function exists
3. Ensure customer booking system calls API
4. Clear browser cache

### Overlapping Blocks

**Problem**: Can create overlapping date blocks  
**Solution**:
This is intentional! Multiple blocks can overlap. To prevent:
- Check existing blocks before creating new ones
- Use the blocks list to see what's already blocked

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Admin can see and navigate calendar
- ✅ Clicking dates selects them (blue)
- ✅ Blocked dates appear in red
- ✅ Customer bookings show in yellow
- ✅ Blocks appear in the list below calendar
- ✅ Customers can't book blocked dates

## 📚 Related Files

- `supabase-availability-schema.sql` - Database setup
- `src/components/admin/availability-calendar.tsx` - Calendar UI
- `src/app/admin/costumes/[id]/page.tsx` - Costume detail page
- `src/app/api/availability/route.ts` - API routes
- `src/app/api/availability/check/route.ts` - Availability checking

## 🌟 Advanced Features (Future)

Consider adding:
- Bulk date blocking (entire months)
- Recurring blocks (every Monday)
- Block templates (common scenarios)
- Conflict warnings
- Availability reports
- Email notifications when blocks are created

---

Your availability management system is ready! Admins can now easily control when costumes are available for rental, ensuring smooth operations and preventing booking conflicts.

