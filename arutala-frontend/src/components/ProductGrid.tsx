import React, { useState, useEffect } from 'react';
import { Product, products } from '../data/products';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, RotateCcw, Search, X } from 'lucide-react';
import { Skeleton } from './Skeleton';

interface ProductGridProps {
  limit?: number;
  showFilters?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const ProductGridSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-pulse" id="product-grid-skeleton">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col space-y-4">
          {/* Image skeleton stage */}
          <Skeleton className="w-full aspect-[3/4] bg-foreground/10 border border-foreground/10 relative flex items-center justify-center overflow-hidden" />

          {/* Details skeleton stage */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-baseline justify-between">
              {/* Title simulation */}
              <Skeleton className="h-5 w-1/2" />
              {/* Price simulation */}
              <Skeleton className="h-4 w-1/4" />
            </div>
            {/* Subtitle simulation */}
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  limit,
  showFilters = true,
}) => {
  const [selectedFamily, setSelectedFamily] = useState<'All' | 'Floral' | 'Woody' | 'Citrus'>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<'All' | 'under-500k' | '500k-550k' | 'over-550k'>('All');
  const [isFamilyOpen, setIsFamilyOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [productList, setProductList] = useState<Product[]>(() => [...products]);
  
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
  
  // Trigger loading simulation whenever active filters or search terms are updated
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450); // Fluid 450ms luxury response window
    return () => clearTimeout(timer);
  }, [selectedFamily, selectedPriceRange, gridSearch]);

  // Keep search state synchronized with URL hash updates
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

  useEffect(() => {
    const handleUpdate = () => {
      setProductList([...products]);
    };
    window.addEventListener('maison-products-updated', handleUpdate);
    return () => window.removeEventListener('maison-products-updated', handleUpdate);
  }, []);

  // Update URL hash safely when typing inside the local grid search bar
  const handleSearchChange = (val: string) => {
    setGridSearch(val);
    const hash = window.location.hash;
    const baseHash = hash.includes('?') ? hash.split('?')[0] : hash || '#/shop';
    const newHash = val.trim() === '' ? baseHash : `${baseHash}?search=${encodeURIComponent(val)}`;
    window.history.replaceState(null, '', window.location.pathname + window.location.search + newHash);
  };

  // Filter products based on selected family, price range, & search query
  const filteredProducts = productList.filter((product) => {
    const matchFamily = selectedFamily === 'All' || product.family === selectedFamily;
    
    let matchPrice = true;
    if (selectedPriceRange === 'under-500k') {
      matchPrice = product.price < 500000;
    } else if (selectedPriceRange === '500k-550k') {
      matchPrice = product.price >= 500000 && product.price <= 550000;
    } else if (selectedPriceRange === 'over-550k') {
      matchPrice = product.price > 550000;
    }

    let matchSearch = true;
    if (gridSearch.trim() !== '') {
      const q = gridSearch.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchSubtitle = product.subtitle.toLowerCase().includes(q);
      const matchNotes = [
        ...product.notes.top,
        ...product.notes.heart,
        ...product.notes.base
      ].some(note => note.toLowerCase().includes(q));
      const matchFamilyStr = product.family.toLowerCase().includes(q);
      const matchDesc = product.description?.toLowerCase().includes(q) || false;
      const matchStory = product.story?.toLowerCase().includes(q) || false;

      matchSearch = matchName || matchSubtitle || matchNotes || matchFamilyStr || matchDesc || matchStory;
    }

    return matchFamily && matchPrice && matchSearch;
  });

  const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  return (
    <div className="space-y-12" id="product-grid-root">
      
      {/* Editorial Scent Family & Price Filters */}
      {showFilters && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-cream pb-6" id="filters-container">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-light text-foreground">
              Discover the Compositions
            </h3>
            <p className="text-xs text-gray-400 font-sans font-light">
              Filter our fine extraits by olfactory signature and precious specimen price.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 relative" id="filter-controls-row">
            {/* Backdrop click-away trigger */}
            {(isFamilyOpen || isPriceOpen) && (
              <div 
                className="fixed inset-0 z-20 cursor-default" 
                onClick={() => {
                  setIsFamilyOpen(false);
                  setIsPriceOpen(false);
                }} 
              />
            )}

            {/* Search Input inside filters bar */}
            <div className="relative z-30 w-full md:w-auto" id="grid-search-wrapper">
              <input
                type="text"
                value={gridSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search note or name..."
                className="pl-8 pr-8 py-2.5 border border-cream bg-background text-[10px] tracking-wider uppercase font-sans font-medium placeholder-gray-400 focus:outline-none focus:border-foreground transition-all duration-300 w-full md:w-44 md:focus:w-56 text-foreground"
              />
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              {gridSearch && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground p-0.5 rounded-full hover:bg-foreground/5 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={10} />
                </button>
              )}
            </div>

            {/* Dropdown 1: Scent Family */}
            <div className="relative z-30 flex-1 md:flex-none" id="family-dropdown-wrapper">
              <button
                id="family-dropdown-trigger"
                onClick={() => {
                  setIsFamilyOpen(!isFamilyOpen);
                  setIsPriceOpen(false);
                }}
                className={`flex w-full items-center justify-between space-x-2 px-5 py-2.5 border ${
                  selectedFamily !== 'All' 
                    ? 'border-foreground bg-foreground text-background' 
                    : 'border-cream bg-background hover:border-accent-gold/50'
                } text-[10px] tracking-[0.2em] font-sans font-medium uppercase transition-all duration-300 rounded-none cursor-pointer`}
              >
                <span>
                  {selectedFamily === 'All' ? 'Scent Family' : `Family: ${selectedFamily}`}
                </span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isFamilyOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isFamilyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-48 bg-background border border-cream shadow-lg rounded-none py-1 z-40"
                    id="family-dropdown-menu"
                  >
                    {(['All', 'Floral', 'Woody', 'Citrus'] as const).map((family) => {
                      const isActive = selectedFamily === family;
                      return (
                        <button
                          key={family}
                          id={`family-option-${family.toLowerCase()}`}
                          onClick={() => {
                            setSelectedFamily(family);
                            setIsFamilyOpen(false);
                          }}
                          className={`w-full text-left px-5 py-2.5 text-[10px] tracking-wider uppercase font-sans font-medium transition-colors cursor-pointer ${
                            isActive 
                              ? 'bg-cream/50 text-accent-gold font-semibold' 
                              : 'text-foreground/70 hover:bg-cream/20 hover:text-foreground'
                          }`}
                        >
                          {family === 'All' ? 'All Families' : family}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dropdown 2: Price Range */}
            <div className="relative z-30 flex-1 md:flex-none" id="price-dropdown-wrapper">
              <button
                id="price-dropdown-trigger"
                onClick={() => {
                  setIsPriceOpen(!isPriceOpen);
                  setIsFamilyOpen(false);
                }}
                className={`flex w-full items-center justify-between space-x-2 px-5 py-2.5 border ${
                  selectedPriceRange !== 'All' 
                    ? 'border-foreground bg-foreground text-background' 
                    : 'border-cream bg-background hover:border-accent-gold/50'
                } text-[10px] tracking-[0.2em] font-sans font-medium uppercase transition-all duration-300 rounded-none cursor-pointer`}
              >
                <span>
                  {selectedPriceRange === 'All' 
                    ? 'Price Range' 
                    : selectedPriceRange === 'under-500k' 
                    ? 'Under Rp 500K' 
                    : selectedPriceRange === '500k-550k' 
                    ? 'Rp 500K — Rp 550K' 
                    : 'Over Rp 550K'}
                </span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${isPriceOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isPriceOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-48 bg-background border border-cream shadow-lg rounded-none py-1 z-40"
                    id="price-dropdown-menu"
                  >
                    {[
                      { value: 'All', label: 'All Prices' },
                      { value: 'under-500k', label: 'Under Rp 500K' },
                      { value: '500k-550k', label: 'Rp 500K — Rp 550K' },
                      { value: 'over-550k', label: 'Over Rp 550K' }
                    ].map((opt) => {
                      const isActive = selectedPriceRange === opt.value;
                      return (
                        <button
                          key={opt.value}
                          id={`price-option-${opt.value}`}
                          onClick={() => {
                            setSelectedPriceRange(opt.value as any);
                            setIsPriceOpen(false);
                          }}
                          className={`w-full text-left px-5 py-2.5 text-[10px] tracking-wider uppercase font-sans font-medium transition-colors cursor-pointer ${
                            isActive 
                              ? 'bg-cream/50 text-accent-gold font-semibold' 
                              : 'text-foreground/70 hover:bg-cream/20 hover:text-foreground'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reset Button */}
            {(selectedFamily !== 'All' || selectedPriceRange !== 'All' || gridSearch.trim() !== '') && (
              <button
                id="reset-filters-btn"
                onClick={() => {
                  setSelectedFamily('All');
                  setSelectedPriceRange('All');
                  handleSearchChange('');
                  setIsFamilyOpen(false);
                  setIsPriceOpen(false);
                }}
                className="flex items-center space-x-1.5 text-[10px] tracking-[0.15em] uppercase font-sans font-medium text-gray-400 hover:text-foreground transition-colors cursor-pointer py-2 px-1 border border-dashed border-gray-200 hover:border-foreground"
              >
                <RotateCcw size={10} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid List or Skeleton */}
      {isLoading ? (
        <ProductGridSkeleton count={limit || (displayedProducts.length > 0 ? displayedProducts.length : 6)} />
      ) : (
        <>
          <motion.div
            key={`${selectedFamily}-${selectedPriceRange}-${gridSearch}-${limit || 'all'}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
          >
            {displayedProducts.map((product) => (
              <motion.div
                key={product.slug}
                variants={itemVariants}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {displayedProducts.length === 0 && (
            <div className="text-center py-24 space-y-4" id="empty-state-container">
              <p className="font-serif italic text-lg text-foreground/50">No fragrances matching this criteria.</p>
              <button
                id="empty-state-reset-btn"
                onClick={() => {
                  setSelectedFamily('All');
                  setSelectedPriceRange('All');
                  handleSearchChange('');
                }}
                className="text-xs tracking-[0.15em] uppercase font-sans font-medium border-b border-foreground/30 pb-1 hover:border-foreground transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};
