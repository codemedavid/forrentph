import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/settings - Get all settings or filter by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const key = searchParams.get('key');

    let query = supabase
      .from('site_settings')
      .select('*');

    if (category) {
      query = query.eq('category', category);
    }

    if (key) {
      query = query.eq('key', key);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings', details: error.message },
        { status: 500 }
      );
    }

    // If requesting a single key, return just that setting
    if (key && data && data.length > 0) {
      return NextResponse.json({ setting: data[0] });
    }

    return NextResponse.json({ settings: data || [] });
  } catch (error) {
    console.error('Error in GET /api/settings:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/settings - Create a new setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, category, description } = body;

    if (!key || !value || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: key, value, and category are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('site_settings')
      .insert({
        key,
        value,
        category,
        description,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating setting:', error);
      return NextResponse.json(
        { error: 'Failed to create setting', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ setting: data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/settings:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

