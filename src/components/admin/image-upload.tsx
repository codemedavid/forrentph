'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  currentImages?: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  folder?: string; // Cloudinary folder name
}

export function ImageUpload({ 
  currentImages = [], 
  onImagesChange, 
  maxImages = 5,
  folder = 'costumes'
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(currentImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync images state when currentImages prop changes (e.g., when editing different costumes)
  useEffect(() => {
    console.log('🖼️ ImageUpload: currentImages changed:', currentImages);
    // Filter out any undefined/null/empty strings
    const validImages = currentImages.filter(img => img && img.trim() !== '');
    setImages(validImages);
    // Reset loading and failed states
    setLoadingStates({});
    setFailedImages({});
    setError(null);
  }, [currentImages]);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setError(null);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image size should be less than 10MB');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Upload via API to Cloudinary
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (err: unknown) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await uploadImage(file);
      if (url) {
        newImages.push(url);
      }
    }

    const updatedImages = [...images, ...newImages];
    console.log('📸 New images added:', newImages);
    console.log('📋 Total images now:', updatedImages);
    setImages(updatedImages);
    onImagesChange(updatedImages);
    setUploading(false);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = async (imageUrl: string, index: number) => {
    try {
      console.log('🗑️ Removing image at index:', index, 'URL:', imageUrl);
      
      // Only try to delete from Cloudinary if it's a Cloudinary URL
      if (imageUrl.includes('cloudinary.com')) {
        const urlParts = imageUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
          const pathParts = urlParts.slice(uploadIndex + 2);
          const publicId = pathParts.join('/').replace(/\.[^/.]+$/, '');

          try {
            await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, {
              method: 'DELETE'
            });
            console.log('✅ Deleted from Cloudinary:', publicId);
          } catch (deleteError) {
            console.error('⚠️ Error deleting from Cloudinary:', deleteError);
          }
        }
      }

      // Remove from state
      const updatedImages = images.filter((_, i) => i !== index);
      console.log('📝 Updated images:', updatedImages);
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (err) {
      console.error('❌ Error removing image:', err);
      setError('Failed to remove image');
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await uploadImage(file);
      if (url) {
        newImages.push(url);
      }
    }

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
    setUploading(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Costume Images
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Upload up to {maxImages} images (max 10MB each, JPG, PNG, WebP, GIF)
          </p>
        </div>
        <Badge variant="secondary">
          {images.length} / {maxImages}
        </Badge>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-2" />
            <p className="text-sm text-gray-600">Uploading images...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP, GIF up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary transition-colors bg-white"
            >
              {/* Loading indicator */}
              {loadingStates[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              )}

              {/* Image or Failed Placeholder */}
              {!failedImages[index] ? (
                <img
                  src={imageUrl}
                  alt={`Costume image ${index + 1}`}
                  className="w-full h-full object-cover absolute inset-0"
                  onLoad={() => {
                    setLoadingStates(prev => ({ ...prev, [index]: false }));
                    setFailedImages(prev => ({ ...prev, [index]: false }));
                    console.log('✅ Image loaded successfully:', imageUrl);
                  }}
                  onError={(e) => {
                    setLoadingStates(prev => ({ ...prev, [index]: false }));
                    setFailedImages(prev => ({ ...prev, [index]: true }));
                    console.error('❌ Image failed to load:', imageUrl);
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p className="text-xs font-medium">Image not found</p>
                  <p className="text-xs px-2 text-center mt-1 text-gray-500">
                    {imageUrl.split('/').pop()?.substring(0, 20) || 'Image'}
                  </p>
                </div>
              )}
              
              {/* Remove button overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(imageUrl, index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Primary badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 z-20">
                  <Badge className="bg-primary text-white text-xs">
                    Primary
                  </Badge>
                </div>
              )}
            </div>
          ))}

          {/* Add more placeholder */}
          {images.length < maxImages && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-colors flex flex-col items-center justify-center text-gray-400 hover:text-primary"
            >
              <ImageIcon className="h-8 w-8 mb-2" />
              <span className="text-xs">Add More</span>
            </button>
          )}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-500">
          The first image will be used as the primary image for this costume.
        </p>
      )}
    </div>
  );
}

