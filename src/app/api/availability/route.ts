import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch availability blocks for a costume
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const costumeId = searchParams.get('costumeId');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (!costumeId) {
      return NextResponse.json(
        { error: 'Costume ID is required' },
        { status: 400 }
      );
    }

    // If year and month provided, get blocked dates for that month
    if (year && month) {
      const { data, error } = await supabase
        .rpc('get_blocked_dates_for_month', {
          p_costume_id: costumeId,
          p_year: parseInt(year),
          p_month: parseInt(month)
        });

      if (error) throw error;

      return NextResponse.json({ blockedDates: data || [] }, { status: 200 });
    }

    // Otherwise, get all availability blocks for the costume
    const { data, error } = await supabase
      .from('availability_blocks')
      .select('*')
      .eq('costume_id', costumeId)
      .order('start_date', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ blocks: data || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}

// POST - Create new availability block
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('availability_blocks')
      .insert([{
        costume_id: body.costumeId,
        start_date: body.startDate,
        end_date: body.endDate,
        reason: body.reason || null,
        created_by: body.createdBy || 'admin'
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ block: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating availability block:', error);
    return NextResponse.json(
      { error: 'Failed to create availability block' },
      { status: 500 }
    );
  }
}

// DELETE - Remove availability block
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const blockId = searchParams.get('id');

    if (!blockId) {
      return NextResponse.json(
        { error: 'Block ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('availability_blocks')
      .delete()
      .eq('id', blockId);

    if (error) throw error;

    return NextResponse.json(
      { message: 'Availability block deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting availability block:', error);
    return NextResponse.json(
      { error: 'Failed to delete availability block' },
      { status: 500 }
    );
  }
}

