import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH /api/bookings/[id]/refund - Process security deposit refund
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { refundAmount, notes } = body;

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

    // Check if costume has been returned
    if (!booking.actual_return_date) {
      return NextResponse.json(
        { error: 'Cannot refund security deposit before costume is returned' },
        { status: 400 }
      );
    }

    // Check if already refunded
    if (booking.security_deposit_refunded) {
      return NextResponse.json(
        { error: 'Security deposit has already been refunded' },
        { status: 400 }
      );
    }

    // Calculate final refund amount (security deposit - late fees)
    const finalRefundAmount = refundAmount || (booking.security_deposit - booking.late_fee_amount);

    // Update the booking with refund information
    const { data, error } = await supabase
      .from('bookings')
      .update({
        security_deposit_refunded: true,
        refund_amount: finalRefundAmount,
        refund_notes: notes || null,
        refund_processed_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error processing refund:', error);
      return NextResponse.json(
        { error: 'Failed to process refund' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      booking: data,
      refundAmount: finalRefundAmount,
      message: `Security deposit refund processed: ₱${finalRefundAmount}`
    });

  } catch (error) {
    console.error('Refund processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}

// GET /api/bookings/[id]/refund - Get refund status
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

    const isEligibleForRefund = booking.actual_return_date !== null && !booking.security_deposit_refunded;
    const estimatedRefund = booking.security_deposit - booking.late_fee_amount;

    return NextResponse.json({
      booking,
      isEligibleForRefund,
      estimatedRefund,
      hasBeenRefunded: booking.security_deposit_refunded,
      securityDeposit: booking.security_deposit,
      lateFeeAmount: booking.late_fee_amount
    });

  } catch (error) {
    console.error('Refund status error:', error);
    return NextResponse.json(
      { error: 'Failed to get refund status' },
      { status: 500 }
    );
  }
}
