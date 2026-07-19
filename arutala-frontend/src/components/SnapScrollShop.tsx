import React, { useState, useRef, useEffect } from 'react';
import { products } from '../data/products';
import { formatRupiah } from '../data/products';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';

interface SnapScrollShopProps {
  limit?: number;
  showIntro?: boolean;
  isEmbedded?: boolean;
}

export const SnapScrollShop: React.FC<SnapScrollShopProps> = ({
  limit,
  showIntro = true,
  isEmbedded = false
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update active index based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = containerRef.current.scrollTop;
      const height = window.innerHeight;
      const index = Math.round(scrollY / height);
      const totalSlides = (limit ? limit : products.length) + (showIntro ? 1 : 0);
      if (index !== activeIndex && index >= 0 && index < totalSlides) {
        setActiveIndex(index);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, [activeIndex]);

  const handleNavigateToDetails = (slug: string) => {
    window.location.hash = `#/product/${slug}`;
  };

  const shopProducts = products.filter(p => p.showInShop !== false);
  const displayedProducts = limit ? shopProducts.slice(0, limit) : shopProducts;
  const totalSlides = displayedProducts.length + (showIntro ? 1 : 0);

  return (
    <div 
      ref={containerRef}
      className={`${isEmbedded ? 'relative' : 'fixed inset-0 z-40'} h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory bg-background`}
      id="snap-scroll-container"
    >
      {/* Slide 0: The Intro Slide */}
      {showIntro && (
        <section className="h-[100dvh] w-full snap-start snap-always flex flex-col items-center justify-center relative bg-cream/5 px-6 pt-20 pb-10 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-2xl text-center space-y-6 relative z-10">
            <p className="text-[10px] tracking-[0.4em] uppercase font-sans font-medium text-foreground/40">
              Cabinet d'Odeurs
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-light text-foreground leading-[1.1] tracking-tight">
              The <span className="italic font-normal">Olfactive</span> Collection
            </h1>
            <p className="text-sm md:text-base font-sans text-foreground/60 font-light leading-relaxed max-w-xl mx-auto">
              Explore our curation of extraits and eau de parfums. Each flacon represents a dedicated sensory exercise. Scroll down to immerse.
            </p>
          </div>
          
          <div className="absolute bottom-12 flex flex-col items-center animate-bounce opacity-50 text-foreground/60">
            <span className="text-[9px] tracking-widest uppercase mb-2 font-sans">Scroll</span>
            <ArrowDown size={16} />
          </div>
        </section>
      )}

      {/* Product Slides */}
      {displayedProducts.map((product, idx) => (
        <section 
          key={product.slug}
          className="h-[100dvh] w-full snap-start snap-always relative overflow-hidden flex items-center"
        >
          {/* Background Image Parallax / Blend */}
          <div className="absolute inset-0 z-0 bg-background">
            <img 
              src={product.images.secondary || product.images.primary}
              alt={product.name}
              className="w-full h-full object-cover object-center opacity-30 md:opacity-40 mix-blend-luminosity grayscale hover:grayscale-0 transition-all duration-[2000ms]"
            />
            {/* Gradient overlay to make text readable */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background via-background/80 to-transparent" />
          </div>

          <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center pt-20 pb-8 md:py-0">
            
            {/* Mobile-only Image (Top) */}
            <div className="flex md:hidden justify-center items-end h-[35vh] sm:h-[45vh] w-full mt-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
                className="w-2/3 max-w-[200px] aspect-[3/4] bg-cream/10 border border-cream/20 shadow-xl relative overflow-hidden"
              >
                <img 
                  src={product.images.primary}
                  alt={`${product.name} bottle`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Left Content / Text (Bottom on mobile) */}
            <div className="space-y-3 md:space-y-8 flex flex-col justify-start md:justify-center h-full text-center md:text-left">
              <div className="space-y-1 md:space-y-2">
                <p className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-sans font-medium text-accent-gold drop-shadow-sm">
                  {product.family} · {product.concentration}
                </p>
                <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-light text-foreground leading-[1] md:leading-[0.9] tracking-tighter drop-shadow-md">
                  {product.name}
                </h2>
              </div>
              
              <p className="text-sm md:text-lg font-serif italic text-foreground/80 max-w-md mx-auto md:mx-0 drop-shadow-sm line-clamp-3 md:line-clamp-none leading-relaxed">
                "{product.story}"
              </p>

              <div className="pt-2 md:pt-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full justify-center md:justify-start">
                <p className="text-sm md:text-base font-sans tracking-widest font-medium text-foreground/90 hidden md:block">
                  {formatRupiah(product.price)}
                </p>
                
                <button
                  onClick={() => handleNavigateToDetails(product.slug)}
                  className="flex items-center justify-center space-x-2 text-[10px] md:text-xs tracking-[0.2em] uppercase font-sans font-medium text-background bg-foreground px-8 py-3 md:px-8 md:py-4 hover:bg-foreground/80 transition-colors w-full max-w-[250px] md:w-auto"
                >
                  <span>Discover Flacon</span>
                </button>
              </div>
            </div>

            {/* Desktop Image (Floating Right) */}
            <div className="hidden md:flex justify-end">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.5 }}
                className="w-2/3 aspect-[3/4] bg-cream/10 border border-cream/20 shadow-2xl relative overflow-hidden"
              >
                <img 
                  src={product.images.primary}
                  alt={`${product.name} bottle`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2000ms]"
                />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Pagination / Dot Navigation */}
      <div className={`${isEmbedded ? 'absolute' : 'fixed'} right-6 md:right-12 top-0 h-[100dvh] z-50 flex flex-col justify-center space-y-2 md:space-y-3 pointer-events-none`}>
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div 
            key={i}
            className={`w-1 md:w-1.5 transition-all duration-500 rounded-full ${activeIndex === i ? 'h-6 md:h-8 bg-accent-gold' : 'h-1 md:h-1.5 bg-foreground/30'}`}
          />
        ))}
      </div>
    </div>
  );
};
