'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { Category } from '@/types';

interface CategoryFormModalProps {
  category?: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id'>) => void;
}

export function CategoryFormModal({ 
  category, 
  isOpen, 
  onClose, 
  onSave 
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    icon: '🎭',
    slug: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        image: category.image,
        icon: category.icon || '🎭',
        slug: category.slug
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
        icon: '🎭',
        slug: ''
      });
    }
  }, [category, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'categories');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        const error = await response.json();
        setUploadError(error.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Generate slug if not provided
    const slug = formData.slug || generateSlug(formData.name);

    const categoryData = {
      ...formData,
      slug,
      image: formData.image || '/images/categories/default.jpg'
    };

    onSave(categoryData);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {category ? 'Edit Category' : 'Add New Category'}
            </h2>
            <p className="text-gray-600">
              {category ? 'Update category information' : 'Create a new category for costumes'}
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
                <CardTitle>Category Image</CardTitle>
                <CardDescription>Upload a representative image for this category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Category preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="h-12 w-12 mb-2" />
                        <p className="text-sm">No image uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      onClick={() => document.getElementById('category-image-input')?.click()}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          {formData.image ? 'Change Image' : 'Upload Image'}
                        </>
                      )}
                    </Button>
                    {formData.image && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      >
                        Remove Image
                      </Button>
                    )}
                  </div>

                  <input
                    id="category-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {uploadError && (
                    <p className="text-sm text-red-600">{uploadError}</p>
                  )}

                  <p className="text-xs text-gray-500">
                    Recommended: 800x600px, max 10MB. Supports JPG, PNG, WebP.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the category details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Inflatable Costumes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe what types of costumes are in this category"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon/Emoji *
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      name="icon"
                      required
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl"
                      placeholder="🎭"
                      maxLength={4}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        Choose an emoji that represents this category
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Common: 🎈 (Inflatable), 🦸 (Character), 🦁 (Animal), 🏛️ (Historical), 👻 (Horror)
                      </p>
                    </div>
                  </div>
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
                    placeholder="Auto-generated from name (e.g., inflatable-costumes)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used in URLs. Leave blank to auto-generate.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {category ? 'Update Category' : 'Create Category'}
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

