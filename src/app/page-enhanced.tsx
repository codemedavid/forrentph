import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CategoryCard, ProductCard, FeatureCard, InfoCard } from '@/components/ui/enhanced-card';
import { categories as mockCategories, costumes as mockCostumes } from '@/data/costumes';
import { ArrowRight, Star, Clock, Users, Sparkles, Info, Package, Heart } from 'lucide-react';
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
      return mockCategories;
    }

    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    return data || mockCategories;
  } catch {
    return mockCategories;
  }
}

async function fetchCostumes(): Promise<Costume[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return mockCostumes;
    }

    const { data } = await supabase
      .from('costumes')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    return data?.map(transformCostume) || mockCostumes;
  } catch {
    return mockCostumes;
  }
}

export default async function Home() {
  const [categories, costumes] = await Promise.all([
    fetchCategories(),
    fetchCostumes()
  ]);
  
  const inflatableCategory = categories.find(cat => cat.slug === 'inflatable-costumes');
  const inflatableCostumes = inflatableCategory 
    ? costumes.filter(costume => costume.categoryId === inflatableCategory.id).slice(0, 6)
    : [];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Modern Design */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-24 md:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-5 py-2 text-sm font-medium shadow-md">
              <Sparkles className="w-4 h-4 mr-2 inline animate-pulse" />
              Premium Costume Rentals
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Rent <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient">Instagramable</span>
              <br />
              <span className="text-foreground">Costumes</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              From T-Rex dinosaurs to Disney and more. We have a wide variety of inflatables to make 
              your next event unforgettable. Budget friendly and quality costumes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/costumes">
                <Button size="lg" className="text-lg px-10 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  Browse Costumes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg" className="text-lg px-10 py-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 border-2">
                  View Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badge Section */}
      <section className="py-12 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground font-medium">Costumes Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10k+</div>
              <div className="text-sm text-muted-foreground font-medium">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-sm text-muted-foreground font-medium">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">9+</div>
              <div className="text-sm text-muted-foreground font-medium">Years of Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-5 py-2 text-sm font-medium">
              <Package className="w-4 h-4 mr-2 inline" />
              Categories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Explore Our Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect costume for any occasion. From inflatable fun to character classics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                description={category.description}
                icon={category.icon || '🎭'}
                count={costumes.filter(c => c.categoryId === category.id).length}
                href={`/categories/${category.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Inflatable Costumes - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-5 py-2 shadow-sm">
              <span className="text-xl mr-2">🎈</span>
              <span className="font-medium">Featured</span>
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Popular Inflatable Costumes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our most popular inflatable costumes that guarantee laughs and fun at any event.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {inflatableCostumes.map((costume) => (
              <ProductCard
                key={costume.id}
                image={costume.images && costume.images.length > 0 && costume.images[0] !== '/images/costumes/placeholder.jpg' ? costume.images[0] : undefined}
                title={costume.name}
                description={costume.description}
                price={costume.pricePerDay}
                badge="Inflatable"
                rating={4.8}
                href={`/costumes/${costume.slug}`}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/costumes?category=inflatable-costumes">
              <Button variant="outline" size="lg" className="rounded-xl shadow-sm hover:shadow-lg transition-all px-8 py-6 text-lg">
                View All Inflatable Costumes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-5 py-2">
              <Heart className="w-4 h-4 mr-2 inline" />
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose Us?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make costume rental easy, affordable, and fun for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Clock}
              title="Flexible Rental Periods"
              description="Choose from 12 hours, 1 day, 3 days, or 1 week rentals. Perfect for any event duration."
              iconColor="primary"
            />
            
            <FeatureCard
              icon={Users}
              title="Easy Booking Process"
              description="Simple online booking with real-time availability. Check dates and book instantly."
              iconColor="blue"
            />
            
            <FeatureCard
              icon={Star}
              title="High Quality Costumes"
              description="Premium costumes that are clean, well-maintained, and guaranteed to impress."
              iconColor="purple"
            />
          </div>
        </div>
      </section>

      {/* Seasonal Info Banner */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <InfoCard
            variant="info"
            icon={Info}
            title="Halloween Season Special"
            description="Book early for Halloween! October 15-31 requires a 3-day minimum rental. Reserve your favorite costume today to avoid disappointment."
          />
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge variant="secondary" className="mb-6 px-5 py-2 shadow-lg">
            <Sparkles className="w-4 h-4 mr-2 inline" />
            Get Started
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make Your Event Memorable?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Browse our collection of amazing costumes and find the perfect one for your next event.
          </p>
          <Link href="/costumes">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-6 shadow-2xl hover:shadow-3xl rounded-xl hover:scale-105 transition-all">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

