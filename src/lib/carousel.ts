import { supabase } from './supabase';

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCarouselSlideData {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateCarouselSlideData extends Partial<CreateCarouselSlideData> {
  id: string;
}

// Fetch all active carousel slides
export async function fetchCarouselSlides(): Promise<CarouselSlide[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase not configured. Using empty carousel.');
      return [];
    }

    const { data, error } = await supabase
      .from('carousel_slides')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('❌ Error fetching carousel slides:', error.message);
      return [];
    }

    return data?.map(transformCarouselSlide) || [];
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return [];
  }
}

// Fetch all carousel slides (for admin)
export async function fetchAllCarouselSlides(): Promise<CarouselSlide[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase not configured.');
      return [];
    }

    const { data, error } = await supabase
      .from('carousel_slides')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('❌ Error fetching carousel slides:', error.message);
      return [];
    }

    return data?.map(transformCarouselSlide) || [];
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return [];
  }
}

// Create a new carousel slide
export async function createCarouselSlide(data: CreateCarouselSlideData): Promise<CarouselSlide | null> {
  try {
    const { data: result, error } = await supabase
      .from('carousel_slides')
      .insert([{
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        button_text: data.buttonText || 'Shop Now',
        button_link: data.buttonLink || '/costumes',
        background_image: data.backgroundImage,
        background_color: data.backgroundColor || '#f8f9fa',
        text_color: data.textColor || '#000000',
        button_color: data.buttonColor || '#dc2626',
        button_text_color: data.buttonTextColor || '#ffffff',
        is_active: data.isActive !== false,
        display_order: data.displayOrder || 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating carousel slide:', error.message);
      return null;
    }

    return transformCarouselSlide(result);
  } catch (error) {
    console.error('❌ Error creating carousel slide:', error);
    return null;
  }
}

// Update a carousel slide
export async function updateCarouselSlide(data: UpdateCarouselSlideData): Promise<CarouselSlide | null> {
  try {
    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.buttonText !== undefined) updateData.button_text = data.buttonText;
    if (data.buttonLink !== undefined) updateData.button_link = data.buttonLink;
    if (data.backgroundImage !== undefined) updateData.background_image = data.backgroundImage;
    if (data.backgroundColor !== undefined) updateData.background_color = data.backgroundColor;
    if (data.textColor !== undefined) updateData.text_color = data.textColor;
    if (data.buttonColor !== undefined) updateData.button_color = data.buttonColor;
    if (data.buttonTextColor !== undefined) updateData.button_text_color = data.buttonTextColor;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;
    if (data.displayOrder !== undefined) updateData.display_order = data.displayOrder;

    const { data: result, error } = await supabase
      .from('carousel_slides')
      .update(updateData)
      .eq('id', data.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating carousel slide:', error.message);
      return null;
    }

    return transformCarouselSlide(result);
  } catch (error) {
    console.error('❌ Error updating carousel slide:', error);
    return null;
  }
}

// Delete a carousel slide
export async function deleteCarouselSlide(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('carousel_slides')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting carousel slide:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error deleting carousel slide:', error);
    return false;
  }
}

// Transform database snake_case to frontend camelCase
function transformCarouselSlide(dbSlide: any): CarouselSlide {
  return {
    id: dbSlide.id,
    title: dbSlide.title,
    subtitle: dbSlide.subtitle,
    description: dbSlide.description,
    buttonText: dbSlide.button_text,
    buttonLink: dbSlide.button_link,
    backgroundImage: dbSlide.background_image,
    backgroundColor: dbSlide.background_color,
    textColor: dbSlide.text_color,
    buttonColor: dbSlide.button_color,
    buttonTextColor: dbSlide.button_text_color,
    isActive: dbSlide.is_active,
    displayOrder: dbSlide.display_order,
    createdAt: dbSlide.created_at,
    updatedAt: dbSlide.updated_at,
  };
}
