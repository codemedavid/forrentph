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

// GET - Fetch single costume
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('costumes')
      .select('*, categories(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    const transformedData = transformCostume(data);

    return NextResponse.json({ costume: transformedData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching costume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch costume' },
      { status: 500 }
    );
  }
}

// PUT - Update costume
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('costumes')
      .update({
        name: body.name,
        description: body.description,
        category_id: body.categoryId,
        images: body.images,
        price_per_day: body.pricePerDay,
        price_per_12_hours: body.pricePer12Hours,
        price_per_week: body.pricePerWeek,
        size: body.size,
        difficulty: body.difficulty,
        setup_time: body.setupTime,
        features: body.features,
        is_available: body.isAvailable,
        slug: body.slug
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const transformedData = transformCostume(data);

    return NextResponse.json({ costume: transformedData }, { status: 200 });
  } catch (error) {
    console.error('Error updating costume:', error);
    return NextResponse.json(
      { error: 'Failed to update costume' },
      { status: 500 }
    );
  }
}

// DELETE - Delete costume
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('costumes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Costume deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting costume:', error);
    return NextResponse.json(
      { error: 'Failed to delete costume' },
      { status: 500 }
    );
  }
}

