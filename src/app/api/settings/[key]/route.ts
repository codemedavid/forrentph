import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/settings/[key] - Get a specific setting by key
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Setting not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching setting:', error);
      return NextResponse.json(
        { error: 'Failed to fetch setting', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ setting: data });
  } catch (error) {
    console.error('Error in GET /api/settings/[key]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/settings/[key] - Update a setting by key
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const body = await request.json();
    const { value, description } = body;

    if (!value) {
      return NextResponse.json(
        { error: 'Missing required field: value' },
        { status: 400 }
      );
    }

    const updateData: { value: Record<string, unknown>; description?: string } = { value };
    if (description !== undefined) {
      updateData.description = description;
    }

    const { data, error } = await supabase
      .from('site_settings')
      .update(updateData)
      .eq('key', key)
      .select()
      .single();

    if (error) {
      console.error('Error updating setting:', error);
      return NextResponse.json(
        { error: 'Failed to update setting', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ setting: data });
  } catch (error) {
    console.error('Error in PUT /api/settings/[key]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/settings/[key] - Delete a setting by key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const { error } = await supabase
      .from('site_settings')
      .delete()
      .eq('key', key);

    if (error) {
      console.error('Error deleting setting:', error);
      return NextResponse.json(
        { error: 'Failed to delete setting', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/settings/[key]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

