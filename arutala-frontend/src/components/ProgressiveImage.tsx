import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Generates a low-res URL if it is an Unsplash URL.
 * By using tiny dimensions (e.g. 32px) and lower quality (q=10) with imgix blur,
 * we create an exceptionally lightweight yet aesthetically pleasing preview.
 */
const getLowResUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', '32');
      urlObj.searchParams.set('h', '42');
      urlObj.searchParams.set('q', '10');
      urlObj.searchParams.set('blur', '10'); // Native Unsplash/Imgix blur
      return urlObj.toString();
    } catch (e) {
      // Regex fallback if URL constructor fails
      return url.replace(/w=\d+/, 'w=32').replace(/h=\d+/, 'h=42').replace(/q=\d+/, 'q=10') + '&blur=10';
    }
  }
  return url;
};

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lowResSrc, setLowResSrc] = useState('');

  useEffect(() => {
    // Generate the low-res URL on mount or src change
    setLowResSrc(getLowResUrl(src));
    // Reset loaded state when src changes
    setIsLoaded(false);
    
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    img.src = src;
    
    if (img.complete) {
      setIsLoaded(true);
    } else {
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setIsLoaded(true); // Remove blur even if image fails to load
    }
  }, [src]);

  return (
    <div 
      className={`relative overflow-hidden w-full h-full select-none ${containerClassName}`}
      id={`progressive-img-container-${Math.random().toString(36).substr(2, 9)}`}
    >
      {/* 1. Shimmering Soft Luxury Background */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-muted to-cream bg-[length:200%_100%] animate-pulse" />
      )}

      {/* 2. Low-Res Blurred Placeholder Image */}
      {lowResSrc && !isLoaded && (
        <motion.img
          src={lowResSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover blur-[8px] scale-105 pointer-events-none ${className}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* 3. High-Res Ultimate Image */}
      <motion.img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0, filter: 'blur(8px)', scale: 1.05 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          filter: isLoaded ? 'blur(0px)' : 'blur(8px)',
          scale: isLoaded ? 1 : 1.05
        }}
        transition={{ 
          duration: 0.9, 
          ease: [0.16, 1, 0.3, 1] // Elegant luxury spring-ease curve
        }}
        className={`w-full h-full object-cover ${className}`}
        {...props}
      />
    </div>
  );
};
