'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Star, Calendar } from 'lucide-react';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity'>('popularity');

  const filteredCostumes = useMemo(() => {
    const filtered = initialCostumes.filter(costume => {
      const matchesSearch = costume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           costume.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || costume.categoryId === selectedCategory;
      const matchesPrice = costume.pricePerDay >= priceRange[0] && costume.pricePerDay <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort costumes
    filtered.sort((a, b) => {
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

    return filtered;
  }, [initialCostumes, searchTerm, selectedCategory, priceRange, sortBy]);

  const selectedCategoryName = initialCategories.find(cat => cat.id === selectedCategory)?.name || 'All Categories';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Hidden on mobile */}
        <div className="hidden lg:block lg:w-64 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search costumes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {initialCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (per day)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange([0, 10000]);
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedCategoryName}
              </h2>
              <p className="text-gray-600">
                {filteredCostumes.length} costume{filteredCostumes.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'popularity')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="popularity">Popularity</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>

          {/* Costumes Grid */}
          {filteredCostumes.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-500 mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No costumes found</h3>
                  <p>Try adjusting your search criteria or filters.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange([0, 10000]);
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCostumes.map((costume) => (
                <CostumeCard key={costume.id} costume={costume} categories={initialCategories} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
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
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">{costume.size}</span>
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

