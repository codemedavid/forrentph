'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { costumes, categories } from '@/data/costumes';
import { Search, Filter, Star, Calendar, DollarSign } from 'lucide-react';
import { Costume } from '@/types';

export default function CostumesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity'>('popularity');

  const filteredCostumes = useMemo(() => {
    let filtered = costumes.filter(costume => {
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
          return b.pricePerDay - a.pricePerDay; // Higher price = more popular for demo
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'All Categories';

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
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
                    {categories.map((category) => (
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
                    setPriceRange([0, 100]);
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
                      setPriceRange([0, 100]);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCostumes.map((costume) => (
                  <CostumeCard key={costume.id} costume={costume} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CostumeCard({ costume }: { costume: Costume }) {
  const category = categories.find(cat => cat.id === costume.categoryId);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
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
              {category?.name}
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
  );
}
