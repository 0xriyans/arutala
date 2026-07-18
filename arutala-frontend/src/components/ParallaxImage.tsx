import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
  intensity?: number; // Adjustment for scroll strength, defaults to 40 (meaning -40px to 40px translation)
  zoomClassName?: string;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className = '',
  referrerPolicy = 'no-referrer',
  intensity = 50,
  zoomClassName = 'transition-transform duration-[1500ms] ease-out group-hover:scale-110'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of this specific container relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Calculate parallax y translation based on scroll progress
  const y = useTransform(scrollYProgress, [0, 1], [-intensity, intensity]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full overflow-hidden ${className}`}
      id="parallax-image-container"
    >
      <motion.div
        style={{ 
          y,
          height: `calc(100% + ${intensity * 2}px)`,
          top: -intensity,
        }}
        className="absolute left-0 right-0 w-full"
        id="parallax-image-inner"
      >
        <img
          src={src}
          alt={alt}
          referrerPolicy={referrerPolicy}
          className={`w-full h-full object-cover object-center absolute inset-0 ${zoomClassName}`}
          id="parallax-image-tag"
        />
      </motion.div>
    </div>
  );
};
