import { NextRequest, NextResponse } from 'next/server';
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

    return NextResponse.json(
      { categories: data || [] },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
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

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: body.name,
        description: body.description || '',
        image: body.image || '/images/categories/default.jpg',
        icon: body.icon || '🎭',
        slug: body.slug || slug
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating category:', error);
      throw error;
    }

    console.log(`✅ Category created: ${data.name}`);

    return NextResponse.json({ category: data }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error in POST /api/categories:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Failed to create category',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
