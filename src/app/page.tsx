import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categories as mockCategories, costumes as mockCostumes } from '@/data/costumes';
import { ArrowRight, Star, Clock, Users, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Category, Costume } from '@/types';
import { HeroCarousel } from '@/components/hero-carousel';
import { fetchCarouselSlides } from '@/lib/carousel';

// Enable ISR - revalidate every hour
export const revalidate = 3600;

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

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
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase not configured. Using mock data. See SETUP_SUPABASE.md for instructions.');
      return mockCategories;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Error fetching categories from Supabase:', error.message || error);
      console.warn('📋 Falling back to mock data. Check your database setup in Supabase.');
      return mockCategories;
    }

    return data || mockCategories;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    console.warn('📋 Using mock data. Check SETUP_SUPABASE.md for configuration instructions.');
    return mockCategories;
  }
}

async function fetchCostumes(): Promise<Costume[]> {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase not configured. Using mock data. See SETUP_SUPABASE.md for instructions.');
      return mockCostumes;
    }

    const { data, error } = await supabase
      .from('costumes')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching costumes from Supabase:', error.message || error);
      console.warn('📋 Falling back to mock data. Check your database setup in Supabase.');
      return mockCostumes;
    }

    return data?.map(transformCostume) || mockCostumes;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    console.warn('📋 Using mock data. Check SETUP_SUPABASE.md for configuration instructions.');
    return mockCostumes;
  }
}

export default async function Home() {
  const [categories, costumes, carouselSlides] = await Promise.all([
    fetchCategories(),
    fetchCostumes(),
    fetchCarouselSlides()
  ]);
  
  // Find the inflatable category by slug instead of hardcoded ID
  const inflatableCategory = categories.find(cat => cat.slug === 'inflatable-costumes');
  const inflatableCostumes = inflatableCategory 
    ? costumes.filter(costume => costume.categoryId === inflatableCategory.id)
    : [];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel slides={carouselSlides} />

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1.5">
              <Sparkles className="w-3 h-3 mr-1.5 inline" />
              Categories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Our Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect costume for any occasion. From inflatable fun to character classics.
            </p>
          </div>
          
          {/* Horizontal Scrollable Categories - Circles */}
          <div className="relative">
            {/* Scroll Container */}
            <div className="flex gap-8 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth hide-scrollbar" 
                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/categories/${category.slug}`}
                  className="flex-shrink-0 snap-center group"
                >
                  <div className="flex flex-col items-center space-y-3 w-32">
                    {/* Circular Image/Icon Container */}
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 p-1 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                          {category.image ? (
                            <>
                              <Image
                                src={category.image}
                                alt={category.name}
                                width={112}
                                height={112}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                sizes="112px"
                                quality={85}
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </>
                          ) : (
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                              <span className="text-5xl relative z-10">
                                {category.icon || '🎭'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Active indicator ring */}
                      <div className="absolute -inset-1 rounded-full border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Category Name */}
                    <div className="text-center">
                      <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {costumes.filter(c => c.categoryId === category.id).length} items
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Fade Edges for Scroll Indication */}
            <div className="absolute left-0 top-0 bottom-6 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-6 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>

          {/* Scroll Hint */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4 animate-pulse" />
              Swipe to see more
            </p>
          </div>
        </div>
      </section>

      {/* Featured Inflatable Costumes */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <span className="text-lg mr-1">🎈</span>
              Featured
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Inflatable Costumes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our most popular inflatable costumes that guarantee laughs and fun at any event.
            </p>
          </div>
          
          {/* Mobile: 2 columns, Tablet: 2 columns, Desktop: 3 columns */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {inflatableCostumes.map((costume) => (
              <Card key={costume.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                <Link href={`/costumes/${costume.slug}`}>
                  <CardHeader className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/5 rounded-t-lg relative overflow-hidden">
                      {costume.images && costume.images.length > 0 && costume.images[0] !== '/images/costumes/placeholder.jpg' ? (
                        <>
                          <Image
                            src={costume.images[0]}
                            alt={costume.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-all duration-300">
                              <span className="text-2xl sm:text-3xl lg:text-4xl">🎈</span>
                            </div>
                            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                              Click to view details
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Inflatable
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                        <span className="text-xs sm:text-sm text-muted-foreground">4.8</span>
                      </div>
                    </div>
                    <CardTitle className="text-sm sm:text-base lg:text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {costume.name}
                    </CardTitle>
                    {/* Hide description on mobile, show on tablet+ with 80 char limit */}
                    <CardDescription className="hidden sm:block text-muted-foreground mb-4 text-sm lg:text-base">
                      {truncateText(costume.description, 80)}
                    </CardDescription>
                    <div className="flex items-center justify-between mt-3 sm:mt-0">
                      <div>
                        <div className="text-base sm:text-lg lg:text-xl font-bold text-primary">
                          ₱{costume.pricePerDay}
                        </div>
                        <div className="text-xs text-muted-foreground">per day</div>
                      </div>
                      <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-xs sm:text-sm">
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              <Link href="/costumes?category=inflatable-costumes">
                View All Inflatable Costumes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Why Choose Us?
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make costume rental easy, affordable, and fun for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Flexible Rental Periods</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Choose from 12 hours, 1 day, 3 days, or 1 week rentals. 
                Perfect for any event duration.
              </p>
            </Card>
            
            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Easy Booking Process</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Simple online booking with real-time availability. 
                Check dates and book instantly.
              </p>
            </Card>
            
            <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">High Quality Costumes</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Premium costumes that are clean, well-maintained, 
                and guaranteed to impress.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Get Started
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4 leading-tight">
            Ready to Make Your Event Memorable?
          </h2>
          <p className="text-lg sm:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Browse our collection of amazing costumes and find the perfect one for your next event.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-6 sm:px-8 py-3 shadow-lg">
            <Link href="/costumes">Start Shopping</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
