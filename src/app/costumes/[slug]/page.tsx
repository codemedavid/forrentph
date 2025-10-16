import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { costumes as mockCostumes, categories as mockCategories } from '@/data/costumes';
import { Costume, Category } from '@/types';
import { CostumeDetailClient } from '@/components/costume-detail-client';

// Enable ISR - revalidate every hour
export const revalidate = 3600;

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
function transformCostume(dbCostume: DbCostume): Costume {
  return {
    id: dbCostume.id,
    name: dbCostume.name,
    description: dbCostume.description,
    categoryId: dbCostume.category_id,
    images: dbCostume.images || [],
    pricePerDay: Number(dbCostume.price_per_day),
    pricePer12Hours: Number(dbCostume.price_per_12_hours),
    pricePerWeek: Number(dbCostume.price_per_week),
    size: dbCostume.size as Costume['size'],
    difficulty: dbCostume.difficulty as Costume['difficulty'],
    setupTime: dbCostume.setup_time,
    features: dbCostume.features || [],
    isAvailable: dbCostume.is_available,
    slug: dbCostume.slug,
  };
}

// Generate static params for all costumes (SSG)
export async function generateStaticParams() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      // Use mock data
      return mockCostumes.map((costume) => ({
        slug: costume.slug,
      }));
    }

    const { data } = await supabase
      .from('costumes')
      .select('slug');
 
    return data?.map((costume) => ({
      slug: costume.slug,
    })) || mockCostumes.map((costume) => ({
      slug: costume.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return mockCostumes.map((costume) => ({
      slug: costume.slug,
    }));
  }
}

async function fetchCostume(slug: string): Promise<Costume | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return mockCostumes.find(c => c.slug === slug) || null;
    }

    const { data, error } = await supabase
      .from('costumes')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return mockCostumes.find(c => c.slug === slug) || null;
    }

    return transformCostume(data);
  } catch (error) {
    console.error('Error fetching costume:', error);
    return mockCostumes.find(c => c.slug === slug) || null;
  }
}

async function fetchCategory(categoryId: string): Promise<Category | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return mockCategories.find(cat => cat.id === categoryId) || null;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error || !data) {
      return mockCategories.find(cat => cat.id === categoryId) || null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return mockCategories.find(cat => cat.id === categoryId) || null;
  }
}

export default async function CostumeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  
  // Fetch costume data on server
  const costume = await fetchCostume(slug);
  
  if (!costume) {
    notFound();
  }
  
  // Fetch category data on server
  const category = await fetchCategory(costume.categoryId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/costumes" className="hover:text-primary">Costumes</Link>
            <span>/</span>
            <span className="text-gray-900">{costume.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Client component for all interactive booking features */}
        <CostumeDetailClient costume={costume} category={category} />
      </div>
    </div>
  );
}
