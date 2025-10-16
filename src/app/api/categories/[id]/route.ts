import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json({ category: data }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching category:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Generate slug if not provided
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const { data, error } = await supabase
      .from('categories')
      .update({
        name: body.name,
        description: body.description || '',
        image: body.image || '/images/categories/default.jpg',
        icon: body.icon || '🎭',
        slug: slug
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }

    console.log(`✅ Category updated: ${data.name}`);

    return NextResponse.json({ category: data }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in PUT /api/categories/[id]:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Failed to update category',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // First check if there are any costumes using this category
    const { data: costumes, error: checkError } = await supabase
      .from('costumes')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (checkError) throw checkError;

    if (costumes && costumes.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete category',
          message: 'This category has costumes associated with it. Please reassign or delete the costumes first.'
        },
        { status: 400 }
      );
    }

    // Delete the category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }

    console.log(`✅ Category deleted: ${id}`);

    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in DELETE /api/categories/[id]:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Failed to delete category',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

