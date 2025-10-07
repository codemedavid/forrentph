import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Check if a costume is available for a date range
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const costumeId = searchParams.get('costumeId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!costumeId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Costume ID, start date, and end date are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .rpc('check_costume_availability', {
        p_costume_id: costumeId,
        p_start_date: startDate,
        p_end_date: endDate
      });

    if (error) throw error;

    const result = data?.[0] || { is_available: false, blocked_dates: [] };

    return NextResponse.json({
      isAvailable: result.is_available,
      blockedDates: result.blocked_dates || []
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}

