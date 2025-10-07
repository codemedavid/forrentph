import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { categories, costumes } from '@/data/costumes';
import { ArrowLeft, Star, Calendar, DollarSign } from 'lucide-react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find(cat => cat.slug === params.slug);
  
  if (!category) {
    notFound();
  }

  const categoryCostumes = costumes.filter(costume => costume.categoryId === category.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-4">
            <Button variant="ghost" asChild>
              <Link href="/categories" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              {category.description}
            </p>
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full">
              <span className="font-medium">{categoryCostumes.length} costumes available</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categoryCostumes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <span className="text-6xl mb-4 block">🎭</span>
                <h3 className="text-lg font-medium mb-2">No costumes in this category yet</h3>
                <p>We're working on adding more costumes to this category. Check back soon!</p>
              </div>
              <Button asChild>
                <Link href="/costumes">Browse All Costumes</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCostumes.map((costume) => (
              <Card key={costume.id} className="group hover:shadow-lg transition-all duration-300">
                <Link href={`/costumes/${costume.slug}`}>
                  <CardHeader className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <span className="text-3xl">🎭</span>
                        </div>
                        <p className="text-sm text-gray-500">Click to view details</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {category.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {costume.name}
                    </CardTitle>
                    
                    <CardDescription className="text-gray-600 mb-4 line-clamp-2">
                      {costume.description}
                    </CardDescription>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Setup: {costume.setupTime} min</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">Size:</span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{costume.size}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          ₱{costume.pricePerDay}
                        </div>
                        <div className="text-xs text-gray-500">per day</div>
                      </div>
                      <Button size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Related Categories */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Explore Other Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories
              .filter(cat => cat.id !== category.id)
              .slice(0, 3)
              .map((relatedCategory) => {
                const relatedCount = costumes.filter(c => c.categoryId === relatedCategory.id).length;
                return (
                  <Card key={relatedCategory.id} className="group hover:shadow-lg transition-all duration-300">
                    <Link href={`/categories/${relatedCategory.slug}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {relatedCategory.name}
                          </h3>
                          <span className="text-2xl">
                            {relatedCategory.name === 'Inflatable Costumes' ? '🎈' :
                             relatedCategory.name === 'Character Costumes' ? '🦸' :
                             relatedCategory.name === 'Animal Costumes' ? '🦁' :
                             relatedCategory.name === 'Historical Costumes' ? '🏛️' :
                             relatedCategory.name === 'Superhero Costumes' ? '🦸‍♂️' :
                             relatedCategory.name === 'Horror Costumes' ? '👻' : '🎭'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {relatedCategory.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {relatedCount} costumes
                          </span>
                          <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                            Explore →
                          </span>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
