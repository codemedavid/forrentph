# Admin Availability Management - Quick Start

## 🎯 What is This?

The Availability Management system lets you control which dates customers can book costumes. Think of it as a "do not disturb" calendar for your costumes!

## ⚡ Quick Start (2 Minutes)

### Step 1: Set Up Database (One-time)
1. Open Supabase: https://supabase.com/dashboard
2. Go to **SQL Editor**
3. Open file: `supabase-availability-schema.sql`
4. Copy all → Paste → Click **Run**
5. Wait for "Success" ✓

### Step 2: Access the Calendar
1. Open your admin panel: `/admin`
2. Click **Inventory** tab
3. Find any costume
4. Click **Manage Availability** button
5. You'll see the calendar!

### Step 3: Block Your First Date
1. Click on tomorrow's date
2. It turns blue (selected)
3. Click **Block Dates** button at bottom
4. Date turns red (blocked) ✓
5. Done!

## 🖱️ Using the Calendar

### Understanding the Colors

| Color | Meaning | Can Click? |
|-------|---------|------------|
| 🔵 Blue | Selected (about to block) | Yes |
| 🔴 Red | Manually blocked by you | No |
| 🟡 Yellow | Booked by customer | No |
| ⚪ White | Available | Yes |
| ⚫ Gray | Past date | No |

### Blocking Single Date

```
1. Click one date
   └─> Turns blue ✓
   
2. Click "Block Dates"
   └─> Turns red ✓
   
3. Customer can't book this date!
```

### Blocking Multiple Dates

```
1. Click first date  → Blue
2. Click second date → Blue  
3. Click third date  → Blue
4. Click "Block Dates"
   └─> All turn red ✓
```

### Blocking with Reason

```
1. Select dates (click them)
2. Click "Add Reason (Optional)"
3. Type: "Cleaning and repairs"
4. Click "Block Dates"
   └─> Saved with reason ✓
```

### Unblocking Dates

```
Scroll down to "Active Availability Blocks"
Find the block you want to remove
Click "Remove" button
└─> Dates available again! ✓
```

## 📅 Common Tasks

### Task 1: Block Weekend for Maintenance
1. Go to costume availability page
2. Click Saturday
3. Click Sunday
4. Add reason: "Weekend maintenance"
5. Click "Block Dates"

### Task 2: Reserve Costume for VIP
1. Select the reservation dates
2. Add reason: "Reserved for [Client Name]"
3. Block dates
4. Contact customer to confirm

### Task 3: Holiday Closure
1. Navigate to December
2. Select Dec 24, 25, 26
3. Reason: "Christmas holiday closure"
4. Block dates

### Task 4: Emergency Repair
1. Quick! Costume is damaged
2. Go to that costume's availability
3. Select today through repair completion
4. Reason: "Emergency repair - torn fabric"
5. Block immediately

## 🎨 Features Explained

### Calendar Navigation
- **Arrow Left** ←: Previous month
- **Arrow Right** →: Next month  
- **Month/Year**: Current view

### Selection Features
- **Single Click**: Select one date
- **Multiple Clicks**: Select multiple dates
- **Cancel**: Click selected date again to deselect

### Block Management
- **Block Button**: Creates the availability block
- **Remove Button**: Deletes the block
- **Reason Field**: Optional note for tracking

### Visual Feedback
- Blue highlight = selected
- Red background = blocked
- Yellow background = booked
- Tooltip shows block reason (hover)

## ⚠️ Important Notes

### You Cannot:
- ❌ Block past dates
- ❌ Unblock customer bookings (must cancel booking instead)
- ❌ Block dates older than today

### You Can:
- ✅ Block today and future dates
- ✅ Block multiple date ranges
- ✅ Remove blocks anytime
- ✅ Add/edit reasons later

### What Happens When You Block:
1. Dates turn red on YOUR calendar
2. Customers see them as unavailable
3. Customers cannot select blocked dates
4. Booking system prevents bookings
5. You can unblock anytime

## 🔄 Real-World Workflow

### Weekly Maintenance Schedule
```
Monday morning:
1. Review upcoming week
2. Block Tuesday for cleaning
3. Add reason: "Weekly deep clean"
4. Customers see unavailable
5. Remove block Tuesday evening
```

### Managing Returns
```
Customer returns costume:
1. Inspect for damage
2. If damaged: Block next 2-3 days
3. Reason: "Repair needed"
4. Schedule repair
5. Unblock when ready
```

### Event Reservations
```
Corporate client calls:
1. They want specific date
2. Block that date immediately
3. Reason: "Reserved - [Company Name]"
4. Confirm with client
5. Convert to actual booking
```

## 📞 Support

### Common Questions

**Q: Can customers see why a date is blocked?**  
A: No, they just see it as unavailable. Reasons are for admin tracking only.

**Q: What if I block the wrong date?**  
A: Just click "Remove" on that block in the list below.

**Q: Can I block an entire month?**  
A: Yes! Select all dates in that month and block them.

**Q: What happens to existing bookings?**  
A: They stay confirmed. You can only block dates that aren't booked.

**Q: Can I schedule blocks for the future?**  
A: Yes! Navigate to any future month and block dates.

## ✅ Checklist

Before going live:
- [ ] Run `supabase-availability-schema.sql`
- [ ] Test blocking a date
- [ ] Test unblocking a date
- [ ] Verify customers can't book blocked dates
- [ ] Check past bookings show in yellow
- [ ] Try blocking multiple dates at once
- [ ] Add a reason to a block
- [ ] Navigate between months
- [ ] Remove a test block

## 🎉 You're Ready!

Your availability management system is fully set up! You can now:
- Block dates for maintenance
- Reserve costumes for special events
- Manage holidays and closures
- Prevent booking conflicts
- Keep your inventory organized

Happy managing! 📅✨

---

For detailed technical information, see:
- `AVAILABILITY_MANAGEMENT.md` - Complete guide
- `supabase-availability-schema.sql` - Database schema
- Component code in `src/components/admin/availability-calendar.tsx`

