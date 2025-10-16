import { supabase } from '@/lib/supabase';
import { costumes as mockCostumes, categories as mockCategories } from '@/data/costumes';
import { Costume, Category } from '@/types';
import { CostumesClientView } from '@/components/costumes-client-view';

// Enable ISR - revalidate every 30 minutes
export const revalidate = 1800;

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

async function fetchCostumes(): Promise<Costume[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase not configured. Using mock data.');
      return mockCostumes;
    }

    const { data, error } = await supabase
      .from('costumes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching costumes:', error.message);
      return mockCostumes;
    }

    return data?.map(transformCostume) || mockCostumes;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return mockCostumes;
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase not configured. Using mock data.');
      return mockCategories;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Error fetching categories:', error.message);
      return mockCategories;
    }

    return data || mockCategories;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return mockCategories;
  }
}

export default async function CostumesPage() {
  // Fetch data on server in parallel
  const [costumes, categories] = await Promise.all([
    fetchCostumes(),
    fetchCategories()
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Costume Catalog
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our extensive collection of high-quality costumes for any occasion.
            </p>
          </div>
        </div>
      </div>

      {/* Client component for interactive filtering */}
      <CostumesClientView initialCostumes={costumes} initialCategories={categories} />
    </div>
  );
}
