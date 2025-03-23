import React from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  loading = 'lazy'
}) => {
  // Get the base filename without extension
  const getBaseFilename = (path: string) => {
    // Extract filename from path
    const filename = path.split('/').pop() || '';
    // Remove extension
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
  };
  
  // Determine if this is a local image or external URL
  const isExternalImage = src.startsWith('http') || src.startsWith('//');
  
  // For local images, use optimized versions
  if (!isExternalImage) {
    const basePath = '/optimized';
    const baseName = getBaseFilename(src);
    const originalExt = src.substring(src.lastIndexOf('.') + 1);
    
    // Determine appropriate size suffix based on width
    let sizeSuffix = '-xl';
    if (width && width <= 640) sizeSuffix = '-sm';
    else if (width && width <= 1024) sizeSuffix = '-md';
    
    return (
      <picture>
        {/* AVIF format */}
        <source
          srcSet={`${basePath}/avif/${baseName}${sizeSuffix}.avif`}
          type="image/avif"
        />
        {/* WebP format */}
        <source
          srcSet={`${basePath}/webp/${baseName}${sizeSuffix}.webp`}
          type="image/webp"
        />
        {/* Original format as fallback */}
        <Image
          src={`${basePath}/${baseName}${sizeSuffix}.${originalExt}`}
          alt={alt}
          width={width}
          height={height}
          className={className}
          sizes={sizes}
          priority={priority}
          loading={loading}
        />
      </picture>
    );
  }
  
  // For external images, just use Next.js Image component
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      loading={loading}
    />
  );
};

export default OptimizedImage;
