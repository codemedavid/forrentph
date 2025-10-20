'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  Save,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { 
  fetchAllCarouselSlides, 
  createCarouselSlide, 
  updateCarouselSlide, 
  deleteCarouselSlide,
  CarouselSlide,
  CreateCarouselSlideData 
} from '@/lib/carousel';

export function CarouselManagement() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreateCarouselSlideData>({
    title: '',
    subtitle: '',
    description: '',
    buttonText: 'Shop Now',
    buttonLink: '/costumes',
    backgroundColor: '#f8f9fa',
    textColor: '#000000',
    buttonColor: '#dc2626',
    buttonTextColor: '#ffffff',
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCarouselSlides();
      setSlides(data);
    } catch (error) {
      console.error('Error loading slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSlide(null);
    setIsCreating(true);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      buttonText: 'Shop Now',
      buttonLink: '/costumes',
      backgroundColor: '#f8f9fa',
      textColor: '#000000',
      buttonColor: '#dc2626',
      buttonTextColor: '#ffffff',
      isActive: true,
      displayOrder: slides.length,
    });
  };

  const handleEdit = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setIsCreating(false);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
      backgroundImage: slide.backgroundImage || '',
      backgroundColor: slide.backgroundColor,
      textColor: slide.textColor,
      buttonColor: slide.buttonColor,
      buttonTextColor: slide.buttonTextColor,
      isActive: slide.isActive,
      displayOrder: slide.displayOrder,
    });
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const newSlide = await createCarouselSlide(formData);
        if (newSlide) {
          setSlides([...slides, newSlide]);
          setIsCreating(false);
          resetForm();
        }
      } else if (editingSlide) {
        const updatedSlide = await updateCarouselSlide({
          id: editingSlide.id,
          ...formData,
        });
        if (updatedSlide) {
          setSlides(slides.map(s => s.id === editingSlide.id ? updatedSlide : s));
          setEditingSlide(null);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving slide:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      try {
        const success = await deleteCarouselSlide(id);
        if (success) {
          setSlides(slides.filter(s => s.id !== id));
        }
      } catch (error) {
        console.error('Error deleting slide:', error);
      }
    }
  };

  const handleToggleActive = async (slide: CarouselSlide) => {
    try {
      const updatedSlide = await updateCarouselSlide({
        id: slide.id,
        isActive: !slide.isActive,
      });
      if (updatedSlide) {
        setSlides(slides.map(s => s.id === slide.id ? updatedSlide : s));
      }
    } catch (error) {
      console.error('Error toggling slide status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      buttonText: 'Shop Now',
      buttonLink: '/costumes',
      backgroundColor: '#f8f9fa',
      textColor: '#000000',
      buttonColor: '#dc2626',
      buttonTextColor: '#ffffff',
      isActive: true,
      displayOrder: 0,
    });
  };

  const cancelEdit = () => {
    setEditingSlide(null);
    setIsCreating(false);
    resetForm();
  };

  if (loading) {
    return <div className="p-6">Loading carousel slides...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Carousel Management</h2>
          <p className="text-muted-foreground">Manage homepage carousel slides</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Slide
        </Button>
      </div>

      {/* Form */}
      {(isCreating || editingSlide) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Create New Slide' : 'Edit Slide'}
            </CardTitle>
            <CardDescription>
              Configure the carousel slide content and appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Main headline"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Small text above title"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Slide description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="Shop Now"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="/costumes"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundImage">Background Image</Label>
              <div className="space-y-2">
                <Input
                  id="backgroundImage"
                  value={formData.backgroundImage || ''}
                  onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                  placeholder="https://example.com/image.jpg or upload image"
                />
                <div className="text-xs text-muted-foreground">
                  Recommended size: 1920x500px (16:5 aspect ratio) for best results
                </div>
                {formData.backgroundImage && (
                  <div className="mt-2">
                    <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={formData.backgroundImage}
                        alt="Background preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <Input
                  id="textColor"
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonColor">Button Color</Label>
                <Input
                  id="buttonColor"
                  type="color"
                  value={formData.buttonColor}
                  onChange={(e) => setFormData({ ...formData, buttonColor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonTextColor">Button Text Color</Label>
                <Input
                  id="buttonTextColor"
                  type="color"
                  value={formData.buttonTextColor}
                  onChange={(e) => setFormData({ ...formData, buttonTextColor: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  className="w-20"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" onClick={cancelEdit} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Slides List */}
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <Card key={slide.id} className={!slide.isActive ? 'opacity-50' : ''}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Slide Preview */}
                <div className="w-48 h-24 flex-shrink-0">
                  <div 
                    className="w-full h-full rounded-lg overflow-hidden relative"
                    style={{ backgroundColor: slide.backgroundColor }}
                  >
                    {slide.backgroundImage ? (
                      <img
                        src={slide.backgroundImage}
                        alt="Slide preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <div className="text-center text-white">
                        <div className="text-xs font-bold truncate">{slide.title}</div>
                        {slide.subtitle && (
                          <div className="text-xs opacity-90 truncate">{slide.subtitle}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={slide.isActive ? 'default' : 'secondary'}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">Order: {slide.displayOrder}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg truncate">{slide.title}</h3>
                  {slide.subtitle && (
                    <p className="text-sm text-muted-foreground truncate">{slide.subtitle}</p>
                  )}
                  {slide.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {slide.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Button: {slide.buttonText}</span>
                    <span>Link: {slide.buttonLink}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(slide)}
                  >
                    {slide.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(slide)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(slide.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {slides.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No carousel slides found.</p>
            <Button onClick={handleCreate} className="mt-4">
              Create First Slide
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
