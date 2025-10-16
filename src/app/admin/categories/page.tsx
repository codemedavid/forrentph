'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/admin/admin-layout';
import { CategoryFormModal } from '@/components/admin/category-form-modal';
import { Plus, Edit, Trash2, Image as ImageIcon, Package } from 'lucide-react';
import { Category } from '@/types';

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchCategories();
      } else {
        alert('Failed to delete category. It may still have costumes associated with it.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    }
  };

  const handleSaveCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const url = selectedCategory 
        ? `/api/categories/${selectedCategory.id}`
        : '/api/categories';
      
      const method = selectedCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });

      if (response.ok) {
        await fetchCategories();
        setIsModalOpen(false);
        setSelectedCategory(null);
      } else {
        alert('Failed to save category. Please try again.');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category. Please try again.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 mt-1">Organize your costume collection</p>
          </div>
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first category</p>
              <Button onClick={handleAddCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Category
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Category Image */}
                <div className="relative h-48 bg-gray-100">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Category Info */}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {category.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {category.slug}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      <CategoryFormModal
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSaveCategory}
      />
    </AdminLayout>
  );
}

