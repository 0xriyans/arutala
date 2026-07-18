import React, { useEffect, useState } from 'react';
import { Product, products, formatRupiah } from '../data/products';
import { FragranceNotes } from '../components/FragranceNotes';
import { useCart } from '../context/cart-context';
import { Reveal } from '../components/Reveal';
import { Plus, Minus, ArrowLeft, ShoppingBag, Truck, Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

import { ProgressiveImage } from '../components/ProgressiveImage';

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24 animate-pulse" id="product-detail-skeleton">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 h-4 w-48 bg-cream/70 rounded-sm" />

        {/* Core Detail Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Image Galleries */}
          <div className="lg:col-span-6 space-y-8">
            {/* Primary Image Stage Skeleton */}
            <div className="w-full aspect-[4/5] bg-cream/60 border border-cream/40 relative flex items-center justify-center overflow-hidden">
              <div className="w-24 h-44 border border-foreground/5 bg-cream/30 rounded-sm opacity-40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-foreground/5 opacity-25" />
              </div>
            </div>

            {/* Secondary shot row */}
            <div className="grid grid-cols-12 gap-6 items-center">
              <div className="col-span-8 bg-cream/45 border border-cream/30 aspect-[4/3]" />
              <div className="col-span-4 pl-4 space-y-2">
                <div className="h-3 w-16 bg-cream" />
                <div className="h-3 w-full bg-cream/70" />
                <div className="h-3 w-3/4 bg-cream/70" />
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Spec details */}
          <div className="lg:col-span-6 space-y-10">
            
            {/* Header Title block */}
            <div className="space-y-4">
              <div className="h-3.5 w-32 bg-cream/85" />
              <div className="flex items-baseline justify-between">
                <div className="h-10 w-2/3 bg-cream" />
                <div className="h-8 w-1/4 bg-cream/90" />
              </div>
              <div className="h-5 w-1/2 bg-cream/60" />
            </div>

            <div className="h-[1px] bg-cream" />

            {/* Poetic Description & Story */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-cream/70" />
              <div className="h-4 w-full bg-cream/70" />
              <div className="h-4 w-5/6 bg-cream/70" />
              <div className="p-5 bg-cream/30 border-l-2 border-[#EBE3D5] space-y-2">
                <div className="h-3 w-full bg-cream/50" />
                <div className="h-3 w-4/5 bg-cream/50" />
              </div>
            </div>

            {/* Order/Bag Action Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Quantity Stepper */}
                <div className="h-12 sm:w-32 bg-cream/30 border border-cream" />
                {/* Add to bag CTA */}
                <div className="h-12 flex-1 bg-cream" />
              </div>
            </div>

            {/* Olfactive Architecture Title */}
            <div className="space-y-3">
              <div className="h-5 w-1/3 bg-cream" />
              <div className="h-3 w-2/3 bg-cream/60" />
              
              {/* Fake notes cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-cream/20 border border-cream/30 h-24" />
                <div className="p-4 bg-cream/20 border border-cream/30 h-24" />
                <div className="p-4 bg-cream/20 border border-cream/30 h-24" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

interface ProductDetailRouteProps {
  slug: string;
}

export const ProductDetailRoute: React.FC<ProductDetailRouteProps> = ({ slug }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'shipping'>('details');
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  
  // Customization state for Discovery Set
  const [selectedVials, setSelectedVials] = useState<string[]>([
    'Rintik', 'Hening', 'Fajar', 'Senja', 'Kala'
  ]);

  // Trigger brief luxury loading simulation on active product detail route swap
  useEffect(() => {
    setIsDetailLoading(true);
    const timer = setTimeout(() => {
      setIsDetailLoading(false);
    }, 500); // Exquisite 500ms smooth transition window
    return () => clearTimeout(timer);
  }, [slug]);

  const [zoomState, setZoomState] = useState({
    x: 0,
    y: 0,
    percentX: 0,
    percentY: 0,
    showLens: false
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    
    setZoomState({
      x,
      y,
      percentX,
      percentY,
      showLens: true
    });
  };

  const handleMouseLeave = () => {
    setZoomState((prev) => ({ ...prev, showLens: false }));
  };

  const handleMouseEnter = () => {
    setZoomState((prev) => ({ ...prev, showLens: true }));
  };

  const [product, setProduct] = useState<Product | undefined>(() => products.find((p) => p.slug === slug));

  useEffect(() => {
    const handleUpdate = () => {
      const found = products.find((p) => p.slug === slug);
      setProduct(found);
    };
    handleUpdate();
    window.addEventListener('maison-products-updated', handleUpdate);
    return () => window.removeEventListener('maison-products-updated', handleUpdate);
  }, [slug]);

  const [stockStatus, setStockStatus] = useState<'loading' | 'healthy' | 'low' | 'out'>('loading');
  const [stockQuantity, setStockQuantity] = useState<number | null>(null);

  useEffect(() => {
    if (product) {
      const fetchStock = async () => {
        try {
          const res = await fetch('/api/admin/inventory');
          if (res.ok) {
            const data = await res.json();
            const inv = data[product.slug];
            if (inv) {
              setStockQuantity(inv.quantity);
              if (inv.quantity === 0) setStockStatus('out');
              else if (inv.quantity <= inv.low_stock_threshold) setStockStatus('low');
              else setStockStatus('healthy');
            } else {
              setStockStatus('healthy');
            }
          }
        } catch (e) {
          setStockStatus('healthy'); // graceful degradation
        }
      };
      fetchStock();
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} — ARUTALA`;
      window.scrollTo({ top: 0 });
    }
  }, [product]);

  if (isDetailLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4 text-center p-6">
        <h2 className="font-serif text-2xl text-foreground font-light">Fragrance Not Found</h2>
        <p className="text-xs text-foreground/50 font-sans max-w-xs">
          The olfactive chapter you are looking for does not exist or has been archived.
        </p>
        <button
          onClick={() => { window.location.hash = '#/shop'; }}
          className="text-xs tracking-[0.2em] uppercase font-sans font-medium text-foreground border-b border-foreground/30 pb-1 hover:border-foreground"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQty = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToBag = () => {
    if (product) {
      if (product.slug === 'discovery-set') {
        addToCart(product, quantity, selectedVials);
      } else {
        addToCart(product, quantity);
      }
    }
  };

  const handleUpdateVial = (index: number, value: string) => {
    const newVials = [...selectedVials];
    newVials[index] = value;
    setSelectedVials(newVials);
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24" id={`product-detail-page-${product.slug}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        
        {/* Subtle Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-y-2 text-[10px] tracking-[0.15em] uppercase font-sans text-foreground/40" id="product-detail-breadcrumbs">
          <button
            onClick={() => { window.location.hash = '#/'; }}
            className="hover:text-foreground transition-colors duration-300"
          >
            Home
          </button>
          <span className="mx-2 text-foreground/20 select-none">/</span>
          <button
            onClick={() => { window.location.hash = '#/shop'; }}
            className="hover:text-foreground transition-colors duration-300"
          >
            Shop
          </button>
          <span className="mx-2 text-foreground/20 select-none">/</span>
          <span className="text-foreground/85 font-medium tracking-[0.12em] truncate max-w-[180px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        {/* Core Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Image Gallery (Oversized 4/5 portrait image + lifestyle) */}
          <div className="lg:col-span-6 flex flex-row lg:flex-col overflow-x-auto snap-x snap-mandatory gap-4 lg:gap-8 pb-4 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 no-scrollbar">
            
            {/* 1. Primary Image (Slide 1 on mobile, Top image on desktop) */}
            <Reveal duration={0.8} className="w-[70vw] min-w-[70vw] lg:w-auto lg:min-w-0 snap-center shrink-0">
              <div 
                className={`w-full aspect-[4/5] bg-cream border border-foreground/5 overflow-hidden shadow-sm relative transition-all duration-300 ${zoomState.showLens ? 'cursor-none border-foreground/10' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                id="interactive-magnifying-container"
              >
                <ProgressiveImage
                  src={product.images.primary}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className={`scale-100 transition-transform duration-500 ${zoomState.showLens ? 'opacity-85' : 'opacity-100'}`}
                />

                {/* Interactive Lens Overlay */}
                {zoomState.showLens && (
                  <div
                    className="absolute pointer-events-none rounded-full border border-foreground/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] overflow-hidden z-20 bg-background"
                    style={{
                      width: '180px',
                      height: '180px',
                      left: `${zoomState.x - 90}px`,
                      top: `${zoomState.y - 90}px`,
                      backgroundImage: `url(${product.images.primary})`,
                      backgroundPosition: `${zoomState.percentX}% ${zoomState.percentY}%`,
                      backgroundSize: '250%', // 2.5x zoom magnification
                      backgroundRepeat: 'no-repeat',
                      boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                    }}
                    id="magnifying-lens-element"
                  >
                    {/* Inner glass highlights and physical lens simulation */}
                    <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />
                    <div className="absolute top-1 left-4 right-4 h-[30%] bg-gradient-to-b from-white/10 to-transparent rounded-t-full pointer-events-none" />
                  </div>
                )}

                {/* Elegant Hover to Inspect Badge */}
                <div 
                  className={`absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-2.5 py-1.5 border border-cream text-[9px] tracking-widest uppercase font-sans font-semibold items-center gap-1.5 pointer-events-none select-none z-10 transition-opacity duration-300 hidden lg:flex ${zoomState.showLens ? 'opacity-0' : 'opacity-100 text-foreground/60'}`}
                  id="magnifier-helper-badge"
                >
                  <Sparkles size={10} className="text-accent-gold" />
                  <span>Hover to Inspect Bottle</span>
                </div>
              </div>
            </Reveal>

            {/* 2. Secondary Image (Slide 2 - Mobile Only) */}
            <Reveal duration={0.8} className="w-[70vw] min-w-[70vw] snap-center shrink-0 lg:hidden block">
              <div className="w-full aspect-[4/5] overflow-hidden bg-cream border border-foreground/5 shadow-sm relative">
                <ProgressiveImage
                  src={product.images.secondary}
                  alt={`${product.name} Detail 1`}
                  referrerPolicy="no-referrer"
                  className="scale-100 transition-transform duration-1000 w-full h-full object-cover"
                />
              </div>
            </Reveal>

            {/* 3. Tertiary Image (Slide 3 - Mobile Only) */}
            {product.images.tertiary && (
              <Reveal duration={0.8} className="w-[70vw] min-w-[70vw] snap-center shrink-0 lg:hidden block">
                <div className="w-full aspect-[4/5] overflow-hidden bg-cream border border-foreground/5 shadow-sm relative">
                  <ProgressiveImage
                    src={product.images.tertiary}
                    alt={`${product.name} Detail 2`}
                    referrerPolicy="no-referrer"
                    className="scale-100 transition-transform duration-1000 w-full h-full object-cover"
                  />
                </div>
              </Reveal>
            )}

            {/* Extended Image Gallery (Desktop Only) */}
            <Reveal delay={0.2} duration={0.8} yOffset={30} className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="overflow-hidden bg-cream border border-foreground/5 aspect-square shadow-sm relative">
                  <ProgressiveImage
                    src={product.images.secondary}
                    alt={`${product.name} Detail 1`}
                    referrerPolicy="no-referrer"
                    className="scale-100 hover:scale-105 transition-transform duration-1000 w-full h-full object-cover"
                  />
                </div>
                {product.images.tertiary ? (
                  <div className="overflow-hidden bg-cream border border-foreground/5 aspect-square shadow-sm relative">
                    <ProgressiveImage
                      src={product.images.tertiary}
                      alt={`${product.name} Detail 2`}
                      referrerPolicy="no-referrer"
                      className="scale-100 hover:scale-105 transition-transform duration-1000 w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col justify-center px-4 space-y-2">
                    <p className="text-[9px] tracking-widest text-foreground/40 font-sans uppercase font-medium">Olfactive Context</p>
                    <p className="font-serif italic text-xs text-foreground/70 leading-normal">
                      Designed to mimic natural moments of absolute raw purity.
                    </p>
                  </div>
                )}
              </div>

            </Reveal>
          </div>

          {/* Right Column: Sticky Spec details */}
          <div className="lg:col-span-6 space-y-10 lg:sticky lg:top-28">
            
            {/* Header Title block */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-[10px] tracking-[0.3em] text-gray-400 uppercase font-sans font-medium">
                <span>{product.family} Olfactory Family</span>
                <span>·</span>
                <span>{product.concentration}</span>
                {stockStatus === 'low' && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-amber-600 bg-amber-900/10 px-2 py-0.5 border border-amber-900/20 rounded-sm font-semibold animate-pulse">
                      <AlertTriangle size={10} />
                      Only {stockQuantity} left
                    </span>
                  </>
                )}
                {stockStatus === 'out' && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-red-600 bg-red-900/10 px-2 py-0.5 border border-red-900/20 rounded-sm font-semibold">
                      Out of Stock
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight">
                  {product.name}
                </h1>
                <span className="font-serif text-lg sm:text-2xl font-light text-foreground/90">{formatRupiah(product.price)}</span>
              </div>
              <p className="font-serif italic text-base sm:text-lg text-gray-500 leading-normal">
                {product.subtitle}
              </p>
            </div>

            <div className="h-[1px] bg-cream w-full" />

            {/* Poetic Description & Story */}
            <div className="space-y-4 font-sans text-sm sm:text-base text-gray-500 font-light leading-relaxed">
              <p>{product.description}</p>
            </div>


            {/* Custom Discovery Set Curations */}
            {product.slug === 'discovery-set' && (
              <div className="space-y-4 p-5 border border-cream bg-cream/10">
                <div className="space-y-1">
                  <h3 className="font-serif text-base text-foreground">Curate Your Set</h3>
                  <p className="text-xs font-sans text-foreground/60">
                    Select the 5 miniature flacons to complete your olfactive journey.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-xs font-mono text-foreground/40 w-4">{index + 1}.</span>
                      <select 
                        value={selectedVials[index]}
                        onChange={(e) => handleUpdateVial(index, e.target.value)}
                        className="flex-1 bg-transparent border-b border-cream py-2 text-sm font-sans text-foreground focus:outline-none focus:border-foreground transition-colors cursor-pointer"
                      >
                        {products.filter(p => p.slug !== 'discovery-set').map(p => (
                          <option key={p.slug} value={p.name} className="bg-background text-foreground">
                            {p.name} — {p.family}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Specifications Tabs (Details, Ingredients, Shipping) */}
            <div className="border border-cream" id="specs-accordion">
              {/* Tabs list */}
              <div className="flex border-b border-cream text-[9px] tracking-widest font-sans uppercase font-medium text-foreground">
                {(['details', 'ingredients', 'shipping'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      flex-1 py-3 text-center transition-all cursor-pointer relative
                      ${activeTab === tab ? 'text-foreground font-semibold' : 'text-foreground/40 hover:text-foreground'}
                    `}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="active-spec-tab"
                        className="absolute bottom-0 inset-x-0 h-[2px] bg-foreground"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content panels */}
              <div className="p-5 text-xs text-gray-500 font-sans leading-relaxed min-h-[100px]">
                {activeTab === 'details' && (
                  <ul className="space-y-2">
                    <li className="flex justify-between border-b border-cream pb-1">
                      <span className="text-gray-400 uppercase tracking-wider font-medium text-[9px]">Concentration</span>
                      <span className="font-serif italic text-foreground font-medium">{product.concentration}</span>
                    </li>
                    <li className="flex justify-between border-b border-cream pb-1">
                      <span className="text-gray-400 uppercase tracking-wider font-medium text-[9px]">Volume</span>
                      <span className="font-mono text-foreground font-medium">{product.volume}</span>
                    </li>
                    <li className="flex justify-between border-b border-cream pb-1">
                      <span className="text-gray-400 uppercase tracking-wider font-medium text-[9px]">Origin</span>
                      <span className="font-serif italic text-foreground font-medium">Jakarta, Indonesia</span>
                    </li>
                    <li className="flex justify-between pb-1">
                      <span className="text-gray-400 uppercase tracking-wider font-medium text-[9px]">Packaging</span>
                      <span className="text-foreground font-light">Lead-free heavy clear glass flacon, hand-stamped label</span>
                    </li>
                  </ul>
                )}

                {activeTab === 'ingredients' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-[9px] uppercase tracking-wider text-foreground/40 font-semibold mb-2">
                      <Sparkles size={10} />
                      <span>Pure Botanical Extract Registry</span>
                    </div>
                    <p className="font-mono leading-normal text-foreground/60 text-[11px]">
                      Alcohol Denat., Parfum (Fragrance), Aqua (Water), Saffron absolute, Mysore Sandalwood extract, Pink Pepper extract, Oakmoss absolute, Limonene, Linalool, Citral, Geraniol, Benzyl Benzoate, Eugenol, Evernia Prunastri extract.
                    </p>
                    <p className="text-[10px] text-foreground/40 pt-1 leading-normal">
                      Vegan. Sourced sustainably. Formulated with zero synthetics, synthetic stabilizers, phthalates, parabens, or heavy colorants.
                    </p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-1.5 text-[9px] uppercase tracking-wider text-foreground/40 font-semibold">
                      <Truck size={10} />
                      <span>Complimentary Concierge Shipping</span>
                    </div>
                    <p className="leading-normal font-light">
                      All Arutala orders include complimentary secure carbon-neutral express courier shipping inside our hand-wrapped signature luxury cream boxes.
                    </p>
                    <p className="leading-normal font-light">
                      Orders are processed and dispatched within 24 hours. Delivery takes 1–2 business days inside metropolitan areas. Returns of unopened flacons are accepted within 14 days of receipt.
                    </p>
                  </div>
                )}
              </div>
            </div>



            {/* Interactive Fragrance Notes widget inside Detail Row */}
            <div className="space-y-4 pt-4 border-t border-cream">
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-medium text-foreground">Olfactive Architecture</h3>
                <p className="text-xs text-gray-400 font-sans font-light">
                  Hover or touch notes below to unlock ingredient details and sourcing.
                </p>
              </div>
              
              {product.images.scent && (
                <div className="w-full aspect-[2/1] overflow-hidden bg-cream border border-foreground/5 shadow-sm relative group">
                  <ProgressiveImage
                    src={product.images.scent}
                    alt={`${product.name} Raw Ingredients`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-1000"
                  />
                </div>
              )}

              <div className="pt-2">
                <FragranceNotes
                  notes={product.notes}
                  noteDescriptions={product.noteDescriptions}
                />
              </div>
            </div>

            {/* Order/Bag Action Bar */}
            <div className="space-y-4 pt-4 border-t border-cream">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between border border-cream px-4 py-3 sm:w-32 bg-cream/20">
                  <button
                    onClick={handleDecreaseQty}
                    className="p-1 text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-mono text-foreground font-medium select-none px-2">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncreaseQty}
                    className="p-1 text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add to bag CTA */}
                <button
                  onClick={handleAddToBag}
                  className="flex-1 bg-foreground text-cream font-sans text-xs font-medium tracking-[0.25em] uppercase py-4 px-8 hover:bg-foreground/95 transition-colors duration-300 shadow-sm flex items-center justify-center space-x-2 cursor-pointer select-none"
                >
                  <ShoppingBag size={14} />
                  <span>Add to Bag</span>
                </button>
              </div>
              
              <p className="text-[10px] tracking-wide text-gray-400 uppercase font-sans text-center sm:text-left">
                Complimentary 2-day delivery & embossed signature gift box.
              </p>
            </div>

          </div>

        </div>

        {/* Full-width Ambience Image Section */}
        {product.images.ambience && (
          <Reveal yOffset={40} duration={1}>
            <div className="mt-20 lg:mt-32 w-full overflow-hidden bg-cream shadow-md relative group">
              <div className="w-full aspect-square md:aspect-[16/9] lg:aspect-[21/9] relative">
                <ProgressiveImage
                  src={product.images.ambience}
                  alt={`${product.name} Atmosphere`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-12 lg:pb-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <p className="text-[10px] tracking-[0.3em] text-white/70 uppercase font-sans font-medium mb-3">Mood & Atmosphere</p>
                    <p className="text-white font-serif italic text-xl lg:text-3xl tracking-wide max-w-2xl mx-auto px-6 leading-relaxed shadow-sm">
                      "{product.story}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}



      </div>
    </div>
  );
};
