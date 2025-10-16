'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  X, 
  Save,
  Plus,
  Trash2
} from 'lucide-react';
import { Costume, Category } from '@/types';
import { categories as mockCategories } from '@/data/costumes';
import { ImageUpload } from './image-upload';

interface CostumeFormModalProps {
  costume?: Costume;
  isOpen: boolean;
  onClose: () => void;
  onSave: (costume: Omit<Costume, 'id'>) => void;
}

export function CostumeFormModal({ 
  costume, 
  isOpen, 
  onClose, 
  onSave 
}: CostumeFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    images: [] as string[],
    pricePerDay: 0,
    pricePer12Hours: 0,
    pricePerWeek: 0,
    size: 'M' as Costume['size'],
    difficulty: 'Easy' as Costume['difficulty'],
    setupTime: 10,
    features: [''] as string[],
    isAvailable: true,
    slug: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        } else {
          console.warn('Failed to fetch categories, using mock data');
          setCategories(mockCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(mockCategories);
      }
    }

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (costume) {
      setFormData({
        name: costume.name,
        description: costume.description,
        categoryId: costume.categoryId,
        images: costume.images || [],
        pricePerDay: costume.pricePerDay,
        pricePer12Hours: costume.pricePer12Hours,
        pricePerWeek: costume.pricePerWeek,
        size: costume.size,
        difficulty: costume.difficulty,
        setupTime: costume.setupTime,
        features: costume.features,
        isAvailable: costume.isAvailable,
        slug: costume.slug
      });
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        images: [],
        pricePerDay: 0,
        pricePer12Hours: 0,
        pricePerWeek: 0,
        size: 'M',
        difficulty: 'Easy',
        setupTime: 10,
        features: [''],
        isAvailable: true,
        slug: ''
      });
    }
  }, [costume, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pricePerDay' || name === 'pricePer12Hours' || name === 'pricePerWeek' || name === 'setupTime' 
        ? Number(value) 
        : value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsCreatingCategory(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newCategory = data.category;
        
        // Add to categories list and select it
        setCategories(prev => [...prev, newCategory]);
        setFormData(prev => ({ ...prev, categoryId: newCategory.id }));
        
        // Reset form
        setNewCategoryName('');
        setNewCategoryDescription('');
        setShowAddCategory(false);
      } else {
        alert('Failed to create category. Please try again.');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. Please try again.');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate slug if not provided
    const slug = formData.slug || generateSlug(formData.name);

    // Filter out empty features
    const features = formData.features.filter(feature => feature.trim() !== '');

    const costumeData = {
      ...formData,
      slug,
      features,
      images: formData.images.length > 0 ? formData.images : ['/images/costumes/placeholder.jpg']
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(costumeData);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {costume ? 'Edit Costume' : 'Add New Costume'}
            </h2>
            <p className="text-gray-600">
              {costume ? 'Update costume information' : 'Create a new costume for rental'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Costume Images</CardTitle>
                <CardDescription>Upload images for this costume</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  currentImages={formData.images}
                  onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                  maxImages={5}
                  folder="costumes"
                />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details of the costume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costume Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter costume name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="categoryId"
                        required
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddCategory(!showAddCategory)}
                        className="whitespace-nowrap"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add New
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Add New Category Form */}
                {showAddCategory && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                    <h4 className="font-medium text-blue-900 flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Category
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="e.g., Superhero Costumes"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description (Optional)
                        </label>
                        <input
                          type="text"
                          value={newCategoryDescription}
                          onChange={(e) => setNewCategoryDescription(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Brief description"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleCreateCategory}
                        disabled={!newCategoryName.trim() || isCreatingCategory}
                      >
                        {isCreatingCategory ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Create Category
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowAddCategory(false);
                          setNewCategoryName('');
                          setNewCategoryDescription('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe the costume"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Auto-generated from name"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set rental prices for different durations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      12 Hours (₱)
                    </label>
                    <input
                      type="number"
                      name="pricePer12Hours"
                      value={formData.pricePer12Hours}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Rate (₱) *
                    </label>
                    <input
                      type="number"
                      name="pricePerDay"
                      required
                      value={formData.pricePerDay}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weekly Rate (₱)
                    </label>
                    <input
                      type="number"
                      name="pricePerWeek"
                      value={formData.pricePerWeek}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>Physical and technical details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size *
                    </label>
                    <select
                      name="size"
                      required
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="One Size">One Size</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty *
                    </label>
                    <select
                      name="difficulty"
                      required
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Setup Time (minutes) *
                    </label>
                    <input
                      type="number"
                      name="setupTime"
                      required
                      value={formData.setupTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>List the key features of this costume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter a feature"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
                <CardDescription>Set the availability status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                    Available for rental
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {costume ? 'Update Costume' : 'Create Costume'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
