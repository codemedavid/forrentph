# 🚀 Quick Setup: 10-Minute Blocking System

## ✅ What You Need to Do

Follow these 3 simple steps to enable the blocking reservation system:

---

## Step 1: Update Database Schema (2 minutes)

1. Go to your **Supabase Dashboard**
2. Open **SQL Editor**
3. Copy the contents of `supabase-blocking-schema.sql`
4. **Paste** into SQL Editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)

### What this does:
- ✅ Adds `blocked_until` column (stores when block expires)
- ✅ Adds `messenger_opened` column (tracks if customer opened link)
- ✅ Adds `booking_reference` column (unique reference like BOOK-ABC123)
- ✅ Adds 'expired' status to bookings
- ✅ Creates helper functions for auto-expiry

---

## Step 2: Restart Your Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

That's it! The code changes are already in place.

---

## Step 3: Test It

### Testing Flow:

1. **Go to a costume page** (e.g., `/costumes/inflatable-trex-costume`)

2. **Select dates** and click "Book Now"

3. **Fill out the form:**
   - Name: Test Customer
   - Email: test@example.com
   - Phone: +63 912 345 6789

4. **Click "Book Now & Message Admin"**

5. **Watch the console:**
   ```
   🔒 Creating temporary reservation...
   ✅ Booking created: BOOK-ABC123-XYZ
   ⏰ Reserved for 10 minutes until: 10:15:00 AM
   📱 Opening Messenger...
   ```

6. **Messenger opens** with pre-filled message including:
   - Booking reference
   - All booking details
   - 10-minute warning

7. **Go to admin panel** (`/admin`)
   - See the booking with status "pending"
   - See the blocking expiry time

8. **Try to book same dates again** (in another browser/incognito)
   - Should see: "Temporarily reserved until 10:15 AM"
   - Booking will be blocked

9. **Wait 10 minutes** or **confirm the booking in admin**
   - If confirmed → Permanent booking
   - If 10 mins pass → Auto-expires → Available again

---

## 🎯 How It Works Now

### Before (Old System):
```
Customer → Fills form → Opens Messenger → Admin receives message
❌ No database record
❌ No blocking
❌ Double-bookings possible
❌ No tracking
```

### After (New System):
```
Customer → Fills form → Creates DB entry with 10-min block
    ↓
Opens Messenger with booking reference
    ↓
Admin sees pending booking in admin panel
    ↓
Admin has 10 minutes to confirm/cancel
    ↓
If confirmed → Permanent booking
If 10 mins pass → Auto-expires → Available again
```

---

## 📊 What You'll See

### In Console (Browser DevTools):

```
🔒 Creating temporary reservation...
✅ Booking created: BOOK-LKJH89-XY45
⏰ Reserved for 10 minutes until: 3:45:30 PM
📱 Opening Messenger...
```

### In Messenger:

```
🎭 COSTUME RENTAL BOOKING REQUEST

📋 BOOKING DETAILS:
• Reference: BOOK-LKJH89-XY45
• Costume: Inflatable T-Rex Costume
• Duration: 1 Day
• Start Date: Jan 15, 2025
• End Date: Jan 16, 2025
• Total Price: ₱2500

⏰ IMPORTANT: This costume is temporarily 
   reserved for you for 10 minutes. Please 
   confirm your booking to secure it!
```

### In Admin Panel:

| Reference | Customer | Costume | Status | Expires In | Action |
|-----------|----------|---------|--------|------------|--------|
| BOOK-LKJH89 | John Doe | T-Rex | Pending | 8 min | Confirm |

---

## 🔥 Key Features Enabled

✅ **10-Minute Temporary Block** - Costume locked for customer  
✅ **Auto-Expiry** - Blocks release automatically after 10 mins  
✅ **Booking Reference** - Unique code for each booking  
✅ **Database Tracking** - All bookings saved to database  
✅ **Messenger Integration** - Pre-filled messages with reference  
✅ **Admin View** - See all pending/expired bookings  
✅ **Double-Booking Prevention** - System blocks overlapping dates  
✅ **Fair Allocation** - First customer to book gets the slot  

---

## 🐛 Troubleshooting

### Issue: "Failed to create booking" error

**Cause:** Database schema not updated

**Fix:** 
1. Run `supabase-blocking-schema.sql` in Supabase SQL Editor
2. Restart your dev server

---

### Issue: Bookings not expiring after 10 minutes

**Check:** Go to admin panel and refresh the page

**Cause:** Auto-expiry runs on API calls

**Fix:** Visit `/admin` or any page that fetches bookings - they'll auto-expire

---

### Issue: Can't see booking reference in Messenger

**Check:** Console logs - should show "✅ Booking created: BOOK-..."

**Cause:** Booking might have failed

**Fix:** Check Supabase logs for errors

---

### Issue: "costume_id" error or similar database error

**Cause:** Column names might be wrong

**Check:** Your `supabase-schema.sql` has proper snake_case columns

---

## 📈 Expected Behavior

### Scenario 1: Customer confirms within 10 minutes
```
T+0:00 → Customer books → Status: pending
T+0:30 → Admin confirms → Status: confirmed ✅
         Costume permanently booked
```

### Scenario 2: Customer doesn't confirm
```
T+0:00 → Customer books → Status: pending
T+10:00 → Auto-expires → Status: expired
          Costume available again ✅
```

### Scenario 3: Two customers try to book same dates
```
T+0:00 → Customer A books → Status: pending (blocked)
T+0:05 → Customer B tries → ❌ Error: "Temporarily reserved"
T+10:00 → Block expires → Both can try again
```

---

## 🎓 Understanding the Flow

```
Customer Side:
    1. Browse costume
    2. Select dates
    3. Fill form
    4. Submit
    5. Database entry created
    6. Messenger opens
    7. Send message to admin
    8. Wait for confirmation

Admin Side:
    1. Receive Messenger message
    2. Check admin panel
    3. See pending booking
    4. Verify details
    5. Confirm booking
    6. Status → confirmed
    7. Costume booked!

System Side:
    1. Create pending booking
    2. Set blocked_until = now + 10 min
    3. Block costume for those dates
    4. Auto-expire if not confirmed
    5. Release block after 10 min
    6. Allow other bookings
```

---

## 🎉 You're Done!

Your costume rental now has:
- ✅ Professional blocking system
- ✅ Auto-expiring reservations
- ✅ Database tracking
- ✅ Messenger integration
- ✅ Admin management
- ✅ No double-bookings

**Test it out and watch it work!** 🚀

---

## 📚 More Information

- **Full documentation:** `BLOCKING_RESERVATION_SYSTEM.md`
- **Admin guide:** `ADMIN_GUIDE.md`
- **API details:** `COMPLETE_INTEGRATION_GUIDE.md`

---

**Questions?** Check the logs in browser console (F12) - they show exactly what's happening at each step!

