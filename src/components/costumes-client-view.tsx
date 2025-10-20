'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Star, Calendar } from 'lucide-react';
import { Costume, Category } from '@/types';

interface CostumesClientViewProps {
  initialCostumes: Costume[];
  initialCategories: Category[];
}

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function CostumesClientView({ initialCostumes, initialCategories }: CostumesClientViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity'>('popularity');

  // Group costumes by category
  const costumesByCategory = useMemo(() => {
    // Filter by search term
    const filtered = initialCostumes.filter(costume => {
      if (!searchTerm) return true;
      return costume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             costume.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Sort costumes
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.pricePerDay - b.pricePerDay;
        case 'popularity':
        default:
          return b.pricePerDay - a.pricePerDay;
      }
    });

    // Group by category and sort by display_order
    const grouped = initialCategories
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0)) // Sort categories by display_order
      .map(category => {
        const costumes = sorted.filter(costume => costume.categoryId === category.id);
        return {
          category,
          costumes
        };
      }).filter(group => group.costumes.length > 0); // Only show categories with costumes

    return grouped;
  }, [initialCostumes, initialCategories, searchTerm, sortBy]);

  const totalCostumes = costumesByCategory.reduce((sum, group) => sum + group.costumes.length, 0);

  const scrollToCategory = (slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      // Account for main header (64px) + category nav (~72px) + padding
      const offset = 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Search and Sort Bar - Hidden on Mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 hidden md:block">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="w-full sm:w-96">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search costumes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Sort and Count */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              {totalCostumes} costume{totalCostumes !== 1 ? 's' : ''} found
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'popularity')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="popularity">Popular</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile: Only show count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:hidden">
        <p className="text-sm text-gray-600 text-center">
          {totalCostumes} costume{totalCostumes !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Category Navigation - Sticky & Scrollable - FULL WIDTH */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 py-4 min-w-max">
              {costumesByCategory.map(({ category, costumes }) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.slug)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all whitespace-nowrap group active:scale-95"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {category.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                    {costumes.length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

      {/* No Results */}
      {totalCostumes === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <div className="text-gray-500">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No costumes found</h3>
              <p className="mb-6">Try a different search term.</p>
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Category Sections */
        <div className="space-y-12">
          {costumesByCategory.map(({ category, costumes }) => (
            <section key={category.id} id={category.slug}>
              {/* Category Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {category.name}
                  </h2>
                </div>
                <p className="text-gray-600 ml-12">
                  {category.description}
                </p>
                <div className="ml-12 mt-1 text-sm text-gray-500">
                  {costumes.length} item{costumes.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Costumes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {costumes.map((costume) => (
                  <CostumeCard key={costume.id} costume={costume} categories={initialCategories} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
      </div>
    </>
  );
}

function CostumeCard({ costume, categories }: { costume: Costume; categories: Category[] }) {
  const category = categories.find((cat: Category) => cat.id === costume.categoryId);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <Link href={`/costumes/${costume.slug}`}>
        <CardHeader className="p-0">
          <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden relative">
            {costume.images && costume.images.length > 0 && costume.images[0] !== '/images/costumes/placeholder.jpg' ? (
              <Image
                src={costume.images[0]}
                alt={costume.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={85}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl sm:text-3xl">🎭</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Click to view details</p>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {category?.name}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
              <span className="text-xs sm:text-sm text-gray-600">4.8</span>
            </div>
          </div>
          
          <CardTitle className="text-sm sm:text-base lg:text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {costume.name}
          </CardTitle>
          
          {/* Description with character limit - hidden on mobile, show on tablet+ */}
          <CardDescription className="hidden sm:block text-gray-600 mb-4 text-sm lg:text-base">
            {truncateText(costume.description, 100)}
          </CardDescription>
          
          {/* Hide setup time and size on mobile */}
          <div className="hidden sm:block space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Setup: {costume.setupTime} min</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">Size:</span>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{costume.size}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 sm:mt-0">
            <div>
              <div className="text-base sm:text-lg lg:text-xl font-bold text-primary">
                ₱{costume.pricePerDay}
              </div>
              <div className="text-xs text-gray-500">per day</div>
            </div>
            <Button size="sm" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">View</span>
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

