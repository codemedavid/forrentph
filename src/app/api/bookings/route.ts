import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper function to expire pending bookings
async function expirePendingBookings() {
  const now = new Date().toISOString();
  
  const { error } = await supabase
    .from('bookings')
    .update({ 
      status: 'expired',
      updated_at: now
    })
    .eq('status', 'pending')
    .not('blocked_until', 'is', null)
    .lt('blocked_until', now);

  if (error) {
    console.error('Error expiring bookings:', error);
  }
}

// Helper function to check if costume is blocked
async function isCostumeBlocked(
  costumeId: string,
  startDate: string,
  endDate: string
): Promise<{ blocked: boolean; blockingBooking?: any }> {
  const now = new Date().toISOString();

  // Check for confirmed bookings or active pending blocks
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('costume_id', costumeId)
    .in('status', ['confirmed', 'pending'])
    .lte('start_date', endDate)
    .gte('end_date', startDate);

  if (error) {
    console.error('Error checking blocks:', error);
    return { blocked: false };
  }

  // Filter in memory for the block expiry check
  const activeBlocks = data?.filter(booking => {
    if (booking.status === 'confirmed') return true;
    if (booking.status === 'pending' && booking.blocked_until) {
      return new Date(booking.blocked_until) > new Date(now);
    }
    return false;
  });

  if (activeBlocks && activeBlocks.length > 0) {
    return { blocked: true, blockingBooking: activeBlocks[0] };
  }

  return { blocked: false };
}

// Generate unique booking reference
function generateBookingReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BOOK-${timestamp}-${random}`;
}

// GET - Fetch all bookings
export async function GET(request: NextRequest) {
  try {
    // First expire old pending bookings
    await expirePendingBookings();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    let query = supabase
      .from('bookings')
      .select('*, costumes(*)') 
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ bookings: data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST - Create new booking with 10-minute block
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Step 1: Expire old pending bookings first
    await expirePendingBookings();

    // Step 2: Check if costume is already blocked for these dates
    const { blocked, blockingBooking } = await isCostumeBlocked(
      body.costumeId,
      body.startDate,
      body.endDate
    );

    if (blocked) {
      const isConfirmed = blockingBooking.status === 'confirmed';
      const message = isConfirmed
        ? 'This costume is already booked for the selected dates.'
        : `This costume is temporarily reserved by another customer until ${new Date(blockingBooking.blocked_until).toLocaleTimeString()}. Please try again later or choose different dates.`;

      return NextResponse.json(
        { 
          error: 'Costume not available',
          message,
          blocked_until: blockingBooking.blocked_until
        },
        { status: 409 }
      );
    }

    // Step 3: Calculate 10-minute block expiry
    const blockedUntil = new Date();
    blockedUntil.setMinutes(blockedUntil.getMinutes() + 10);

    // Step 4: Generate booking reference
    const bookingReference = generateBookingReference();

    // Step 5: Create the booking with block
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        costume_id: body.costumeId,
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone,
        start_date: body.startDate,
        end_date: body.endDate,
        total_price: body.totalPrice,
        status: 'pending',
        special_requests: body.specialRequests || null,
        blocked_until: blockedUntil.toISOString(),
        messenger_opened: false,
        booking_reference: bookingReference
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log(`✅ Booking created: ${bookingReference}`);
    console.log(`🔒 Blocked until: ${blockedUntil.toLocaleTimeString()}`);

    return NextResponse.json({ 
      booking: data,
      bookingReference,
      message: 'Costume reserved for 10 minutes'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create booking',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

