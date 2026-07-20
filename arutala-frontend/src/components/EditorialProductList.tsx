import React from 'react';
import { products } from '../data/products';
import { Reveal, StaggerContainer, StaggerItem } from './Reveal';
import { Compass, Eye, MapPin } from 'lucide-react';
import { ParallaxImage } from './ParallaxImage';

interface EditorialProductListProps {
  limit?: number;
  isFeaturedOnly?: boolean;
  excludeSlugs?: string[];
  includeSlugs?: string[];
}

export const EditorialProductList: React.FC<EditorialProductListProps> = ({ limit, isFeaturedOnly = false, excludeSlugs = [], includeSlugs }) => {
  const collectionProducts = products.filter(p => p.showInCollection !== false);
  
  let filteredProducts = collectionProducts;
  if (includeSlugs && includeSlugs.length > 0) {
    // Exact match and order by includeSlugs
    filteredProducts = includeSlugs
      .map(slug => collectionProducts.find(p => p.slug === slug))
      .filter(Boolean) as typeof products;
  } else {
    filteredProducts = collectionProducts.filter(p => !excludeSlugs.includes(p.slug));
    if (isFeaturedOnly) {
      filteredProducts = filteredProducts.filter(p => p.isFeatured);
    }
  }
  
  const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  const handleNavigateToDetails = (slug: string) => {
    window.location.hash = `#/product/${slug}`;
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-background py-16 md:py-32 overflow-hidden" id="editorial-product-list">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="space-y-32 md:space-y-44">
          {displayedProducts.map((product, idx) => {
            const isEven = idx % 2 === 0;
            const accentColor = idx % 3 === 0 ? 'text-[#C5A880]' : idx % 3 === 1 ? 'text-[#E0B2B2]' : 'text-[#A8B29E]';

            return (
              <div 
                key={product.slug} 
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center`}
              >
                {/* Image Column - Alternates Side */}
                <div 
                  className={`lg:col-span-6 overflow-hidden relative group ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <Reveal 
                    duration={1} 
                    yOffset={40}
                    className="aspect-square sm:aspect-[4/5] lg:aspect-[3/4] xl:aspect-[4/5] bg-foreground/5 relative overflow-hidden rounded-sm md:rounded-none"
                  >
                    {/* Artistic Thin Frame */}
                    <div className="absolute inset-3 md:inset-4 border border-white/20 z-10 pointer-events-none transition-all duration-700 group-hover:inset-5 md:group-hover:inset-6" />
                    
                    <ParallaxImage 
                      src={product.images.primary} 
                      alt={product.name}
                      intensity={40}
                      className="w-full h-full"
                      zoomClassName="w-full h-full object-cover grayscale-[15%] transition-all duration-[1500ms] ease-out group-hover:scale-110 group-hover:grayscale-0"
                    />
                    
                    {/* Overlay Label */}
                    <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-10 text-white font-serif italic text-base md:text-lg opacity-85">
                      {product.volume.split(' /')[0]}
                    </div>
                  </Reveal>
                </div>

                {/* Content Column */}
                <div 
                  className={`lg:col-span-6 space-y-6 md:space-y-8 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <StaggerContainer delay={0.2} className="space-y-6">
                    
                    {/* Category Stamp */}
                    <StaggerItem yOffset={15}>
                      <span className="inline-block text-[9px] tracking-[0.3em] uppercase font-sans font-semibold text-accent-gold border border-accent-gold/20 px-3 py-1 bg-accent-gold/5">
                        {product.family} Signature
                      </span>
                    </StaggerItem>

                    {/* Titles */}
                    <StaggerItem yOffset={15} className="space-y-2">
                      <p className="text-xs tracking-wider uppercase font-sans font-light text-foreground/50">
                        {product.concentration}
                      </p>
                      <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm font-sans text-foreground/60 italic">
                        {product.subtitle}
                      </p>
                    </StaggerItem>

                    {/* Deep Description */}
                    <StaggerItem yOffset={20}>
                      <p className="text-xs sm:text-sm font-sans text-foreground/70 font-light leading-relaxed">
                        {product.story}
                      </p>
                    </StaggerItem>

                    {/* Atmospheric Terroir details */}
                    <StaggerItem yOffset={25} className="pt-4">
                      <div className="grid grid-cols-3 gap-4 border-t border-foreground/10 pt-6">
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 text-foreground/50">
                            <span className={accentColor}><MapPin size={14} /></span>
                            <span className="text-[9px] uppercase tracking-widest font-sans font-medium">Top Notes</span>
                          </div>
                          <p className="text-[10px] sm:text-xs font-serif text-foreground font-light truncate">
                            {product.notes.top.slice(0, 2).join(', ')}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 text-foreground/50">
                            <span className={accentColor}><Compass size={14} /></span>
                            <span className="text-[9px] uppercase tracking-widest font-sans font-medium">Heart Notes</span>
                          </div>
                          <p className="text-[10px] sm:text-xs font-serif text-foreground font-light truncate">
                            {product.notes.heart.slice(0, 2).join(', ')}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 text-foreground/50">
                            <span className={accentColor}><Eye size={14} /></span>
                            <span className="text-[9px] uppercase tracking-widest font-sans font-medium">Base Notes</span>
                          </div>
                          <p className="text-[10px] sm:text-xs font-serif text-foreground font-light truncate">
                            {product.notes.base.slice(0, 2).join(', ')}
                          </p>
                        </div>

                      </div>
                    </StaggerItem>

                    <StaggerItem yOffset={30} className="pt-8">
                      <button 
                        onClick={() => handleNavigateToDetails(product.slug)}
                        className="bg-foreground text-background border border-foreground px-8 py-3 text-[10px] tracking-[0.2em] uppercase font-sans font-medium hover:bg-transparent hover:text-foreground transition-colors duration-300 w-full sm:w-auto"
                      >
                        Discover Flacon
                      </button>
                    </StaggerItem>

                  </StaggerContainer>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
