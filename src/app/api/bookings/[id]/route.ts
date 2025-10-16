import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
  status: string;
  special_requests?: string;
  created_at: string;
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
    status: dbBooking.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
    specialRequests: dbBooking.special_requests,
    createdAt: new Date(dbBooking.created_at),
  };
}

// GET - Fetch single booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('bookings')
      .select('*, costumes(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    const transformedData = transformBooking(data);

    return NextResponse.json({ booking: transformedData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PATCH - Update booking (partial update for status, messenger_opened, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Build update object with only provided fields
    const updateData: { status?: string; messenger_opened?: boolean } = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.messenger_opened !== undefined) updateData.messenger_opened = body.messenger_opened;

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Booking ${id} updated:`, updateData);

    const transformedData = transformBooking(data);

    return NextResponse.json({ booking: transformedData }, { status: 200 });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// PUT - Update booking (full update)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('bookings')
      .update({
        costume_id: body.costumeId,
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone,
        start_date: body.startDate,
        end_date: body.endDate,
        total_price: body.totalPrice,
        status: body.status,
        special_requests: body.specialRequests
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const transformedData = transformBooking(data);

    return NextResponse.json({ booking: transformedData }, { status: 200 });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE - Delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}

