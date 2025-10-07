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
    size: dbCostume.size,
    difficulty: dbCostume.difficulty,
    setupTime: dbCostume.setup_time,
    features: dbCostume.features || [],
    isAvailable: dbCostume.is_available,
    slug: dbCostume.slug,
  };
}

// GET - Fetch costume by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { data, error } = await supabase
      .from('costumes')
      .select('*, categories(*)')
      .eq('slug', params.slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return NextResponse.json(
          { error: 'Costume not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    const transformedData = transformCostume(data);

    return NextResponse.json({ costume: transformedData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching costume by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch costume' },
      { status: 500 }
    );
  }
}

