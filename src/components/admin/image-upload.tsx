'use client';

import { useState, useRef, useEffect } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync images state when currentImages prop changes (e.g., when editing different costumes)
  useEffect(() => {
    console.log('🖼️ ImageUpload: currentImages changed:', currentImages);
    setImages(currentImages);
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
      // Extract public ID from Cloudinary URL
      // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/filename.jpg
      const urlParts = imageUrl.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
        // Get everything after 'upload/v1234567/'
        const pathParts = urlParts.slice(uploadIndex + 2);
        const publicId = pathParts.join('/').replace(/\.[^/.]+$/, ''); // Remove file extension

        // Delete from Cloudinary via API
        try {
          await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, {
            method: 'DELETE'
          });
        } catch (deleteError) {
          console.error('Error deleting from Cloudinary:', deleteError);
          // Continue even if delete fails - remove from UI
        }
      }

      // Remove from state
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } catch (err) {
      console.error('Error removing image:', err);
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
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-colors"
            >
              <img
                src={imageUrl}
                alt={`Costume image ${index + 1}`}
                className="w-full h-full object-cover"
                onLoad={() => {
                  console.log('✅ Image loaded successfully:', imageUrl);
                }}
                onError={(e) => {
                  console.error('❌ Image failed to load:', imageUrl);
                  const target = e.target as HTMLImageElement;
                  // Show a better placeholder with the image URL for debugging
                  target.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                      <rect width="200" height="200" fill="#f3f4f6"/>
                      <text x="50%" y="45%" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle" dy=".3em">Image not found</text>
                      <text x="50%" y="55%" font-family="Arial" font-size="10" fill="#9ca3af" text-anchor="middle" dy=".3em">${imageUrl.length > 30 ? imageUrl.substring(0, 30) + '...' : imageUrl}</text>
                    </svg>
                  `)}`;
                }}
              />
              
              {/* Overlay with remove button */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <Button
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
                <div className="absolute top-2 left-2">
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

