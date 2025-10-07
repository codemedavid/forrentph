import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categories, costumes } from '@/data/costumes';
import { ArrowRight, Star, Clock, Users, Sparkles } from 'lucide-react';

export default function Home() {
  const featuredCostumes = costumes.slice(0, 6);
  const inflatableCostumes = costumes.filter(costume => costume.categoryId === '1');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium Costume Rentals
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Rent Amazing
              <span className="text-primary block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Costumes
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              From inflatable costumes to character outfits, we have everything you need 
              to make your next event unforgettable. High-quality rentals with flexible pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3 shadow-lg">
                <Link href="/costumes">Browse Costumes</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <Link href="/categories">View Categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Categories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Our Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect costume for any occasion. From inflatable fun to character classics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
                <Link href={`/categories/${category.slug}`}>
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/5 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                        <span className="text-3xl">
                          {category.name === 'Inflatable Costumes' ? '🎈' :
                           category.name === 'Character Costumes' ? '🦸' :
                           category.name === 'Animal Costumes' ? '🦁' :
                           category.name === 'Historical Costumes' ? '🏛️' :
                           category.name === 'Superhero Costumes' ? '🦸‍♂️' :
                           category.name === 'Horror Costumes' ? '👻' : '🎭'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-4">
                      {category.description}
                    </CardDescription>
                    <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {inflatableCostumes.map((costume) => (
              <Card key={costume.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                <Link href={`/costumes/${costume.slug}`}>
                  <CardHeader className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/5 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="text-center">
                        <div className="w-24 h-24 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                          <span className="text-4xl">🎈</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Click to view details
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Inflatable
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-muted-foreground">4.8</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {costume.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-4 line-clamp-2">
                      {costume.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          ₱{costume.pricePerDay}
                        </div>
                        <div className="text-xs text-muted-foreground">per day</div>
                      </div>
                      <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Details
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Flexible Rental Periods</h3>
              <p className="text-muted-foreground">
                Choose from 12 hours, 1 day, 3 days, or 1 week rentals. 
                Perfect for any event duration.
              </p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Easy Booking Process</h3>
              <p className="text-muted-foreground">
                Simple online booking with real-time availability. 
                Check dates and book instantly.
              </p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">High Quality Costumes</h3>
              <p className="text-muted-foreground">
                Premium costumes that are clean, well-maintained, 
                and guaranteed to impress.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Get Started
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Make Your Event Memorable?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Browse our collection of amazing costumes and find the perfect one for your next event.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3 shadow-lg">
            <Link href="/costumes">Start Shopping</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
