import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateSeasonalRental } from '@/lib/utils';

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

interface BookingRecord {
  id: string;
  costume_id: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  blocked_until: string;
}

// Helper function to check if costume is blocked
async function isCostumeBlocked(
  costumeId: string,
  startDate: string,
  endDate: string
): Promise<{ blocked: boolean; blockingBooking?: BookingRecord }> {
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

// Transform database snake_case to frontend camelCase
interface DbBooking {
  id: string;
  costume_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  total_price: number;
  security_deposit: number;
  late_return_fee_per_hour: number;
  actual_return_date?: string;
  late_fee_amount: number;
  security_deposit_refunded: boolean;
  pickup_time_start: string;
  pickup_time_end: string;
  refund_amount?: number;
  refund_notes?: string;
  refund_processed_at?: string;
  status: string;
  special_requests?: string;
  created_at: string;
  booking_reference?: string;
}

function transformBooking(dbBooking: DbBooking) {
  return {
    id: dbBooking.id,
    costumeId: dbBooking.costume_id,
    customerName: dbBooking.customer_name,
    customerEmail: dbBooking.customer_email,
    customerPhone: dbBooking.customer_phone,
    startDate: new Date(dbBooking.start_date),
    endDate: new Date(dbBooking.end_date),
    totalPrice: Number(dbBooking.total_price),
    securityDeposit: Number(dbBooking.security_deposit),
    lateReturnFeePerHour: Number(dbBooking.late_return_fee_per_hour),
    actualReturnDate: dbBooking.actual_return_date ? new Date(dbBooking.actual_return_date) : undefined,
    lateFeeAmount: Number(dbBooking.late_fee_amount),
    securityDepositRefunded: dbBooking.security_deposit_refunded,
    pickupTimeStart: dbBooking.pickup_time_start,
    pickupTimeEnd: dbBooking.pickup_time_end,
    refundAmount: dbBooking.refund_amount ? Number(dbBooking.refund_amount) : undefined,
    refundNotes: dbBooking.refund_notes,
    refundProcessedAt: dbBooking.refund_processed_at ? new Date(dbBooking.refund_processed_at) : undefined,
    status: dbBooking.status as 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'expired',
    specialRequests: dbBooking.special_requests,
    createdAt: new Date(dbBooking.created_at),
    bookingReference: dbBooking.booking_reference,
  };
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

    const transformedData = data?.map(transformBooking) || [];

    return NextResponse.json({ bookings: transformedData }, { status: 200 });
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

    // Step 2: Validate seasonal rental rules
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const seasonalValidation = validateSeasonalRental(startDate, endDate);
    
    if (!seasonalValidation.valid) {
      return NextResponse.json(
        { 
          error: 'Invalid rental duration for season',
          message: seasonalValidation.error
        },
        { status: 400 }
      );
    }

    // Step 3: Check if costume is already blocked for these dates
    const { blocked, blockingBooking } = await isCostumeBlocked(
      body.costumeId,
      body.startDate,
      body.endDate
    );

    if (blocked && blockingBooking) {
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

    // Step 4: Calculate 10-minute block expiry
    const blockedUntil = new Date();
    blockedUntil.setMinutes(blockedUntil.getMinutes() + 10);

    // Step 5: Generate booking reference
    const bookingReference = generateBookingReference();

    // Step 6: Create the booking with block
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
        security_deposit: 1000.00, // ₱1000 per costume
        late_return_fee_per_hour: 30.00, // ₱30 per hour (can be adjusted to ₱50)
        actual_return_date: null,
        late_fee_amount: 0.00,
        security_deposit_refunded: false,
        pickup_time_start: '08:00:00', // 8:00 AM
        pickup_time_end: '10:00:00', // 10:00 AM
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create booking',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

