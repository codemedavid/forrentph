import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { categories as mockCategories, costumes as mockCostumes } from '@/data/costumes';
import { ArrowRight, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Category, Costume } from '@/types';

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
      console.error('❌ Error fetching categories:', error.message || error);
      console.warn('📋 Falling back to mock data.');
      return mockCategories;
    }

    return data || mockCategories;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    console.warn('📋 Using mock data.');
    return mockCategories;
  }
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
      .eq('is_available', true);

    if (error) {
      console.error('❌ Error fetching costumes:', error.message || error);
      console.warn('📋 Falling back to mock data.');
      return mockCostumes;
    }

    return data?.map(transformCostume) || mockCostumes;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    console.warn('📋 Using mock data.');
    return mockCostumes;
  }
}

export default async function CategoriesPage() {
  const [categories, costumes] = await Promise.all([
    fetchCategories(),
    fetchCostumes()
  ]);

  const categoriesWithCounts = categories.map(category => ({
    ...category,
    count: costumes.filter(costume => costume.categoryId === category.id).length
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Costume Categories
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of costume categories. From inflatable fun to character classics, 
              we have something for every occasion.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile: Horizontal Scrollable Grid */}
        <div className="block md:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categoriesWithCounts.map((category) => (
              <div key={category.id} className="flex-shrink-0 w-64">
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                  <Link href={`/categories/${category.slug}`}>
                    <CardHeader className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <span className="text-2xl font-bold text-primary">
                            {category.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="h-3 w-3 mr-1" />
                          {category.count}
                        </div>
                      </div>
                      
                      <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {category.description}
                      </CardDescription>
                      
                      <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                        <span className="text-xs font-medium">Explore</span>
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Regular Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesWithCounts.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link href={`/categories/${category.slug}`}>
                <CardHeader className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg flex items-center justify-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="text-3xl font-bold text-primary">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {category.count}
                    </div>
                  </div>
                  
                  <CardDescription className="text-gray-600 mb-4">
                    {category.description}
                  </CardDescription>
                  
                  <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium">Explore Collection</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Featured Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Check out our most popular costume categories that customers love.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inflatable Costumes */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Inflatable Costumes</h3>
                  <span className="text-2xl">🎈</span>
                </div>
                <p className="text-gray-600 mb-4">
                  Our most popular category! Hilarious inflatable costumes that guarantee 
                  laughs and fun at any event. Perfect for parties and casual gatherings.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {costumes.filter(c => {
                      const inflatableCat = categories.find(cat => cat.slug === 'inflatable-costumes');
                      return inflatableCat ? c.categoryId === inflatableCat.id : false;
                    }).length} costumes available
                  </div>
                  <Link href="/categories/inflatable-costumes">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Character Costumes */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Character Costumes</h3>
                  <span className="text-2xl">🦸</span>
                </div>
                <p className="text-gray-600 mb-4">
                  Become your favorite character! From superheroes to movie characters, 
                  we have authentic costumes that bring your favorite stories to life.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {costumes.filter(c => {
                      const characterCat = categories.find(cat => cat.slug === 'character-costumes');
                      return characterCat ? c.categoryId === characterCat.id : false;
                    }).length} costumes available
                  </div>
                  <Link href="/categories/character-costumes">
                    <ArrowRight className="h-5 w-5 text-purple-600" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-primary text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Can&apos;t Find What You&apos;re Looking For?
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                Contact us and we&apos;ll help you find the perfect costume for your event. 
                We&apos;re always adding new costumes to our collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <button className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Contact Us
                  </button>
                </Link>
                <Link href="/costumes">
                  <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                    Browse All Costumes
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
