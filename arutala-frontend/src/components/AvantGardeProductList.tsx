import React, { useState, useEffect } from 'react';
import { Product, products } from '../data/products';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, X } from 'lucide-react';
import { formatRupiah } from '../data/products';

interface AvantGardeProductListProps {
  showFilters?: boolean;
  limit?: number;
}

export const AvantGardeProductList: React.FC<AvantGardeProductListProps> = ({
  showFilters = true,
  limit,
}) => {
  const [selectedFamily, setSelectedFamily] = useState<'All' | 'Floral' | 'Woody' | 'Citrus'>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<'All' | 'under-500k' | '500k-550k' | 'over-550k'>('All');
  const [isFamilyOpen, setIsFamilyOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);

  // Parse search query from URL hash on initialization
  const [gridSearch, setGridSearch] = useState(() => {
    const hash = window.location.hash;
    const qIndex = hash.indexOf('?');
    if (qIndex !== -1) {
      const params = new URLSearchParams(hash.substring(qIndex + 1));
      return params.get('search') || params.get('q') || '';
    }
    return '';
  });

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedFamily, selectedPriceRange, gridSearch]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const qIndex = hash.indexOf('?');
      let query = '';
      if (qIndex !== -1) {
        const params = new URLSearchParams(hash.substring(qIndex + 1));
        query = params.get('search') || params.get('q') || '';
      }
      setGridSearch(query);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  let filteredProducts = products.filter((product) => {
    const matchesFamily = selectedFamily === 'All' || product.family === selectedFamily;
    let matchesPrice = true;
    if (selectedPriceRange === 'under-500k') matchesPrice = product.price < 500000;
    else if (selectedPriceRange === '500k-550k') matchesPrice = product.price >= 500000 && product.price <= 550000;
    else if (selectedPriceRange === 'over-550k') matchesPrice = product.price > 550000;
    const matchesSearch = product.name.toLowerCase().includes(gridSearch.toLowerCase()) || 
                          product.family.toLowerCase().includes(gridSearch.toLowerCase()) ||
                          product.notes.top.join(' ').toLowerCase().includes(gridSearch.toLowerCase());
    return matchesFamily && matchesPrice && matchesSearch;
  });

  if (limit) {
    filteredProducts = filteredProducts.slice(0, limit);
  }

  const clearFilters = () => {
    setSelectedFamily('All');
    setSelectedPriceRange('All');
    if (gridSearch) {
      const url = new URL(window.location.href);
      url.hash = '#/shop';
      window.history.pushState({}, '', url);
      setGridSearch('');
    }
  };

  return (
    <div className="relative min-h-[70vh] flex flex-col md:flex-row">
      
      {/* Background Hover Image Container (Visible mostly on Desktop, fades in) */}
      <AnimatePresence>
        {hoveredProduct && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 w-full md:w-1/2 pointer-events-none z-0 overflow-hidden hidden md:block"
          >
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/90 z-10" />
            <img 
              src={hoveredProduct.images.primary} 
              alt={hoveredProduct.name}
              className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full z-10 flex flex-col pt-8">
        {/* Filters Top Bar */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cream/30 pb-6 mb-12 gap-6">
            
            {/* Minimal Search Indicator */}
            {gridSearch ? (
              <div className="flex items-center space-x-3 text-xs tracking-widest font-sans uppercase">
                <span className="text-foreground/40">Searching:</span>
                <span className="font-serif italic text-foreground normal-case text-base">"{gridSearch}"</span>
                <button onClick={() => clearFilters()} className="p-1 hover:text-rose-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-foreground/40 text-xs font-sans uppercase tracking-widest">
                <Search size={14} />
                <span>Index</span>
              </div>
            )}

            {/* Dropdown Filters */}
            <div className="flex items-center space-x-8">
              {/* Family Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setIsFamilyOpen(!isFamilyOpen); setIsPriceOpen(false); }}
                  className="flex items-center space-x-2 text-[10px] tracking-widest uppercase font-sans font-medium text-foreground hover:text-foreground/70 transition-colors"
                >
                  <span className={selectedFamily !== 'All' ? 'text-accent-gold' : 'text-foreground/40'}>Family</span>
                  <span>{selectedFamily === 'All' ? 'All' : selectedFamily}</span>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${isFamilyOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isFamilyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-4 w-48 bg-background border border-cream shadow-2xl py-2 z-30"
                    >
                      {['All', 'Floral', 'Woody', 'Citrus'].map((family) => (
                        <button
                          key={family}
                          onClick={() => { setSelectedFamily(family as any); setIsFamilyOpen(false); }}
                          className={`w-full text-left px-6 py-3 text-xs font-sans tracking-wider uppercase transition-colors hover:bg-cream/20 ${selectedFamily === family ? 'text-foreground font-semibold' : 'text-foreground/60'}`}
                        >
                          {family}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Price Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setIsPriceOpen(!isPriceOpen); setIsFamilyOpen(false); }}
                  className="flex items-center space-x-2 text-[10px] tracking-widest uppercase font-sans font-medium text-foreground hover:text-foreground/70 transition-colors"
                >
                  <span className={selectedPriceRange !== 'All' ? 'text-accent-gold' : 'text-foreground/40'}>Price</span>
                  <span>
                    {selectedPriceRange === 'All' ? 'All' : 
                     selectedPriceRange === 'under-500k' ? '< 500k' :
                     selectedPriceRange === '500k-550k' ? '500k-550k' : '> 550k'}
                  </span>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${isPriceOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isPriceOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-4 w-56 bg-background border border-cream shadow-2xl py-2 z-30"
                    >
                      {[
                        { id: 'All', label: 'All Prices' },
                        { id: 'under-500k', label: 'Under Rp 500.000' },
                        { id: '500k-550k', label: 'Rp 500.000 - Rp 550.000' },
                        { id: 'over-550k', label: 'Over Rp 550.000' }
                      ].map((range) => (
                        <button
                          key={range.id}
                          onClick={() => { setSelectedPriceRange(range.id as any); setIsPriceOpen(false); }}
                          className={`w-full text-left px-6 py-3 text-xs font-sans tracking-wider uppercase transition-colors hover:bg-cream/20 ${selectedPriceRange === range.id ? 'text-foreground font-semibold' : 'text-foreground/60'}`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Text-First List */}
        <div className="flex flex-col space-y-2 md:space-y-0" id="avant-garde-list">
          {isLoading ? (
            <div className="flex flex-col space-y-8 py-12 opacity-50 animate-pulse">
              <div className="h-10 bg-cream/30 w-full" />
              <div className="h-10 bg-cream/30 w-3/4" />
              <div className="h-10 bg-cream/30 w-5/6" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center border border-cream border-dashed">
              <p className="font-serif italic text-2xl text-foreground mb-4">No compositions found.</p>
              <button onClick={clearFilters} className="text-xs uppercase tracking-widest font-sans font-medium text-foreground border-b border-foreground/30 pb-1">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="w-full pb-32">
              <div className="hidden md:grid grid-cols-12 gap-6 border-b border-foreground/10 pb-4 mb-4 text-[9px] tracking-widest uppercase font-sans font-medium text-foreground/40">
                <div className="col-span-1">No.</div>
                <div className="col-span-4">Composition</div>
                <div className="col-span-3">Family</div>
                <div className="col-span-2">Volume</div>
                <div className="col-span-2 text-right">Price</div>
              </div>
              
              {filteredProducts.map((product, idx) => (
                <div 
                  key={product.slug}
                  onMouseEnter={() => setHoveredProduct(product)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => {
                    window.scrollTo(0,0);
                    window.location.hash = `#/product/${product.slug}`;
                  }}
                  className="group relative cursor-pointer border-b border-foreground/5 md:border-foreground/10 hover:border-foreground/40 transition-colors duration-500"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-6 md:py-8 items-center">
                    
                    {/* Index */}
                    <div className="hidden md:block col-span-1 text-xs font-mono text-foreground/30 group-hover:text-foreground/80 transition-colors">
                      {(idx + 1).toString().padStart(2, '0')}
                    </div>

                    {/* Name & Subtitle */}
                    <div className="col-span-1 md:col-span-4 flex flex-col">
                      <h3 className="font-serif text-3xl md:text-4xl text-foreground group-hover:italic transition-all duration-500 origin-left">
                        {product.name}
                      </h3>
                      <p className="text-[10px] tracking-widest uppercase font-sans text-foreground/40 mt-2 block md:hidden">
                        {product.family} · {formatRupiah(product.price)}
                      </p>
                    </div>

                    {/* Family */}
                    <div className="hidden md:block col-span-3 text-xs tracking-widest uppercase font-sans text-foreground/60 group-hover:text-foreground transition-colors">
                      {product.family}
                    </div>

                    {/* Volume */}
                    <div className="hidden md:block col-span-2 text-xs font-mono text-foreground/50 group-hover:text-foreground transition-colors">
                      {product.volume.split(' / ')[0]}
                    </div>

                    {/* Price */}
                    <div className="hidden md:block col-span-2 text-right text-sm font-sans font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                      {formatRupiah(product.price)}
                    </div>
                  </div>
                  
                  {/* Subtle hover background highlight */}
                  <div className="absolute inset-0 bg-cream opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none -z-10" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
