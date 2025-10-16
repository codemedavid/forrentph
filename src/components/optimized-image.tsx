import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  fill = false,
  width,
  height,
  sizes = '100vw',
}: OptimizedImageProps) {
  // Handle placeholder images or missing images
  if (
    !src ||
    src === '/images/costumes/placeholder.jpg' ||
    src.includes('placeholder')
  ) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/5',
          className
        )}
      >
        <span className="text-4xl">🎭</span>
      </div>
    );
  }

  const imageProps = fill
    ? { fill: true }
    : { width: width || 500, height: height || 500 };

  return (
    <Image
      src={src}
      alt={alt}
      {...imageProps}
      className={cn('object-cover', className)}
      sizes={sizes}
      priority={priority}
      quality={85}
    />
  );
}

