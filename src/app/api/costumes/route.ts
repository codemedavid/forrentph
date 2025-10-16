import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface DbCostume {
  id: string;
  name: string;
  description: string;
  category_id: string;
  images: string[];
  price_per_day: number;
  price_per_12_hours: number;
  price_per_week: number;
  size: string;
  difficulty: string;
  setup_time: number;
  features: string[];
  is_available: boolean;
  slug: string;
}

// Transform database snake_case to frontend camelCase
function transformCostume(dbCostume: DbCostume) {
  return {
    id: dbCostume.id,
    name: dbCostume.name,
    description: dbCostume.description,
    categoryId: dbCostume.category_id,
    images: dbCostume.images || [],
    pricePerDay: Number(dbCostume.price_per_day),
    pricePer12Hours: Number(dbCostume.price_per_12_hours),
    pricePerWeek: Number(dbCostume.price_per_week),
    size: dbCostume.size as 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size',
    difficulty: dbCostume.difficulty as 'Easy' | 'Moderate' | 'Advanced',
    setupTime: dbCostume.setup_time,
    features: dbCostume.features || [],
    isAvailable: dbCostume.is_available,
    slug: dbCostume.slug,
  };
}

// GET - Fetch all costumes
export async function GET() {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase not configured in API route. Returning empty array.');
      return NextResponse.json({ 
        costumes: [], 
        message: 'Supabase not configured. Please set up .env.local file.' 
      }, { status: 200 });
    }

    const { data, error } = await supabase
      .from('costumes')
      .select('*, categories(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error.message || error);
      throw error;
    }

    const transformedData = data?.map(transformCostume) || [];
    console.log(`✅ API returning ${transformedData.length} costumes`);

    return NextResponse.json(
      { costumes: transformedData },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error in GET /api/costumes:', errorMessage);
    return NextResponse.json(
      { 
        costumes: [],
        error: 'Failed to fetch costumes',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// POST - Create new costume
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('costumes')
      .insert([{
        name: body.name,
        description: body.description,
        category_id: body.categoryId,
        images: body.images || [],
        price_per_day: body.pricePerDay,
        price_per_12_hours: body.pricePer12Hours,
        price_per_week: body.pricePerWeek,
        size: body.size,
        difficulty: body.difficulty,
        setup_time: body.setupTime,
        features: body.features || [],
        is_available: body.isAvailable !== undefined ? body.isAvailable : true,
        slug: body.slug
      }])
      .select()
      .single();

    if (error) throw error;

    const transformedData = transformCostume(data);

    return NextResponse.json({ costume: transformedData }, { status: 201 });
  } catch (error) {
    console.error('Error creating costume:', error);
    return NextResponse.json(
      { error: 'Failed to create costume' },
      { status: 500 }
    );
  }
}

