import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all categories
export async function GET() {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase not configured in API route. Returning empty array.');
      return NextResponse.json({ 
        categories: [], 
        message: 'Supabase not configured. Please set up .env.local file.' 
      }, { status: 200 });
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Supabase error:', error.message || error);
      throw error;
    }

    console.log(`✅ API returning ${data?.length || 0} categories`);

    return NextResponse.json({ categories: data || [] }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error in GET /api/categories:', errorMessage);
    return NextResponse.json(
      { 
        categories: [],
        error: 'Failed to fetch categories',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
