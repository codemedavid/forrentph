import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateLateReturnFee, isReturnLate } from '@/lib/utils';

// PATCH /api/bookings/[id]/return - Mark costume as returned and calculate fees
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { actualReturnDate } = await request.json();
    
    if (!actualReturnDate) {
      return NextResponse.json(
        { error: 'Actual return date is required' },
        { status: 400 }
      );
    }

    const returnDateTime = new Date(actualReturnDate);

    // Get the booking details
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Calculate late return fee if applicable
    const expectedReturnDate = new Date(booking.end_date);
    let lateFeeAmount = 0;
    
    if (isReturnLate(returnDateTime, expectedReturnDate)) {
      lateFeeAmount = calculateLateReturnFee(
        returnDateTime, 
        expectedReturnDate, 
        booking.late_return_fee_per_hour || 30
      );
    }

    // Update the booking with return information
    const { data, error } = await supabase
      .from('bookings')
      .update({
        actual_return_date: returnDateTime.toISOString(),
        late_fee_amount: lateFeeAmount,
        status: 'completed'
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      booking: data,
      lateFeeAmount,
      isLateReturn: lateFeeAmount > 0,
      message: lateFeeAmount > 0 
        ? `Costume returned late. Late fee: ₱${lateFeeAmount}`
        : 'Costume returned on time'
    });

  } catch (error) {
    console.error('Return processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process return' },
      { status: 500 }
    );
  }
}

// GET /api/bookings/[id]/return - Get return status and fees
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    const expectedReturnDate = new Date(booking.end_date);
    const isCurrentlyLate = booking.status !== 'completed' && isReturnLate(now, expectedReturnDate);
    
    let currentLateFee = 0;
    if (isCurrentlyLate) {
      currentLateFee = calculateLateReturnFee(
        now, 
        expectedReturnDate, 
        booking.late_return_fee_per_hour || 30
      );
    }

    return NextResponse.json({
      booking,
      isCurrentlyLate,
      currentLateFee,
      hasBeenReturned: booking.actual_return_date !== null,
      securityDepositRefunded: booking.security_deposit_refunded
    });

  } catch (error) {
    console.error('Return status error:', error);
    return NextResponse.json(
      { error: 'Failed to get return status' },
      { status: 500 }
    );
  }
}
