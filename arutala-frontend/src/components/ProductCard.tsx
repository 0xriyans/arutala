import React, { useState } from 'react';
import { Product, formatRupiah } from '../data/products';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/cart-context';
import { ProgressiveImage } from './ProgressiveImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleNavigate = () => {
    window.location.hash = `#/product/${product.slug}`;
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering navigation
    addToCart(product, 1);
  };

  return (
    <div
      onClick={handleNavigate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col space-y-4 cursor-pointer relative select-none"
      id={`product-card-${product.slug}`}
    >
      {/* Product Image Stage */}
      <div className="w-full aspect-[3/4] bg-cream overflow-hidden relative border border-cream">
        
        {/* Primary Product Image with Progressive Blur-Up & Subtle Zoom */}
        <div className="w-full h-full transition-transform duration-[1200ms] ease-out group-hover:scale-108">
          <ProgressiveImage
            src={product.images.primary}
            alt={product.name}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Secondary Cross-Fading Lifestyle Image with Subtle Zoom */}
        <div
          className={`
            absolute inset-0 transition-opacity duration-[800ms] ease-out
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div className="w-full h-full transition-transform duration-[1200ms] ease-out group-hover:scale-108">
            <ProgressiveImage
              src={product.images.secondary}
              alt={`${product.name} Atmosphere`}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Quick Add Overlay Button (sliding up from bottom of image container on hover) */}
        <div className="absolute inset-x-0 bottom-0 p-4 z-20 overflow-hidden">
          <button
            onClick={handleQuickAdd}
            className={`
              w-full bg-background/90 backdrop-blur-md text-foreground text-[10px] tracking-[0.2em] font-sans font-medium py-3 px-4 uppercase transition-all duration-[400ms] cubic-bezier(0.16, 1, 0.3, 1) flex items-center justify-center space-x-2 border border-foreground/10 hover:bg-foreground hover:text-cream hover:border-transparent
              ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
            `}
          >
            <ShoppingBag size={12} />
            <span>Quick Add</span>
          </button>
        </div>

        {/* Top left Family Badge */}
        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-background/95 backdrop-blur-md border border-cream text-[9px] tracking-[0.15em] font-sans font-medium uppercase text-foreground/60">
          {product.family}
        </div>
      </div>

      {/* Details Container with Sliding Animation on Hover */}
      <div className="flex flex-col space-y-1 overflow-hidden relative">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-lg md:text-xl text-foreground font-medium relative inline-block transition-colors duration-300 group-hover:text-accent-gold">
            {product.name}
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-gold transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
          </h3>
          <span className="font-serif text-sm md:text-base font-medium text-foreground">{formatRupiah(product.price)}</span>
        </div>

        {/* Slidable Overlay Panel (Subtitles slides down, Details Slide Up) */}
        <div className="relative h-6 overflow-hidden">
          {/* Default subtitle */}
          <div
            className={`
              absolute inset-x-0 top-0 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
              ${isHovered ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
            `}
          >
            <p className="text-xs text-foreground/50 font-sans font-light truncate">
              {product.subtitle}
            </p>
          </div>

          {/* Hover details */}
          <div
            className={`
              absolute inset-x-0 top-0 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex items-center space-x-1
              ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
            `}
          >
            <Eye size={12} className="text-foreground/40" />
            <span className="text-[10px] tracking-[0.15em] font-sans text-foreground/60 uppercase font-medium">
              View Olfactive Detail
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
