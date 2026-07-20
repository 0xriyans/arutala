import React, { useEffect, useState } from 'react';
import { Product, products, formatRupiah } from '../data/products';
import { FragranceNotes } from '../components/FragranceNotes';
import { useCart } from '../context/cart-context';
import { Reveal, StaggerContainer, StaggerItem } from '../components/Reveal';
import { Plus, Minus, ArrowLeft, ShoppingBag, Truck, Sparkles, AlertTriangle, Droplets, FlaskConical, MapPin, Package } from 'lucide-react';
import { motion } from 'motion/react';

import { ProgressiveImage } from '../components/ProgressiveImage';
import { ChatWidget } from '../components/ChatWidget';

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
    <div className="bg-background min-h-screen pt-24 pb-24" id={`product-detail-page-${product.slug}`}>
      
      {/* Product Typography Hero (Exclusive to Discovery Set) */}
      {product.slug === 'discovery-set' && (
        <div className="w-full flex items-center justify-center pt-24 pb-16 md:pt-32 md:pb-24 border-b border-foreground/5 relative overflow-hidden mb-12">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="text-center space-y-8 px-6 max-w-3xl relative z-10">
            <StaggerContainer delay={0.1} className="flex flex-col items-center">
              <StaggerItem yOffset={20}>
                <div className="inline-flex items-center gap-4 mb-4">
                  <div className="w-12 h-[1px] bg-accent-gold/40" />
                  <p className="text-[9px] tracking-[0.5em] uppercase font-sans font-medium text-accent-gold">
                    Your Olfactive Journey
                  </p>
                  <div className="w-12 h-[1px] bg-accent-gold/40" />
                </div>
              </StaggerItem>
              <StaggerItem yOffset={30}>
                <h1 className="font-serif text-6xl md:text-8xl lg:text-[110px] font-light text-foreground leading-[0.85] tracking-tight capitalize">
                  {product.name.slice(0, Math.ceil(product.name.length / 2))}
                  <span className="italic text-accent-gold/90">{product.name.slice(Math.ceil(product.name.length / 2))}.</span>
                </h1>
              </StaggerItem>
              <StaggerItem yOffset={20}>
                <p className="font-sans text-sm md:text-base text-gray-500 font-light max-w-lg mx-auto leading-relaxed mt-10">
                  An intimate introduction to the ARUTALA collection. Curate five chapters of memories, beautifully presented in 2ml glass flacons, waiting to unfold on your skin.
                </p>
              </StaggerItem>
              <StaggerItem yOffset={20}>
                <div className="mt-16 w-[1px] h-24 mx-auto relative overflow-hidden bg-foreground/10">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-gold/50 to-transparent animate-pulse" />
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      )}

      {/* Discovery Set Exclusive Editorial Wording */}
      {product.slug === 'discovery-set' && (
        <div className="w-full bg-background py-24 md:py-32 border-b border-foreground/5 mb-12">
          <div className="max-w-4xl mx-auto px-6 space-y-24 md:space-y-32">
            
            {/* The Genesis */}
            <Reveal yOffset={30}>
              <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                <div className="md:w-1/3">
                  <p className="text-[9px] tracking-[0.3em] uppercase font-sans font-medium text-foreground/40 border-b border-foreground/10 pb-4">
                    The Genesis
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mt-6 leading-tight">
                    Why We Created <br className="hidden md:block" />
                    <span className="italic">Discovery</span>
                  </h3>
                </div>
                <div className="md:w-2/3 space-y-6 pt-2">
                  <p className="font-serif italic text-lg md:text-xl text-foreground/80 leading-relaxed border-l-2 border-accent-gold/30 pl-6">
                    "Choosing a fragrance should never be a blind transaction. It is the beginning of a very personal relationship."
                  </p>
                  <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8]">
                    Shopping for perfume online often forces you to guess based on mere descriptions and reviews. We wanted to completely disrupt this impersonal, high-risk experience. The <strong className="font-medium text-foreground">ARUTALA Discovery Set</strong> was born out of a desire to bring the intimate boutique atelier consultation directly into your living room.
                  </p>
                  <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8]">
                    We want you to smell the actual terroir of our Indian Sandalwood, feel the resinous warmth of our Amber, and witness how each delicate top note dances with your unique skin chemistry over several hours—long before you ever commit to a full-size flacon.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Chapter 1: Invitation */}
            <Reveal yOffset={30}>
              <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                <div className="md:w-1/3">
                  <p className="text-[9px] tracking-[0.3em] uppercase font-sans font-medium text-foreground/40 border-b border-foreground/10 pb-4">
                    Chapitre I
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mt-6 leading-tight">
                    A Personal <br className="hidden md:block" />
                    <span className="italic">Invitation</span>
                  </h3>
                </div>
                <div className="md:w-2/3 space-y-6 pt-2">
                  <p className="font-serif italic text-lg md:text-xl text-foreground/80 leading-relaxed border-l-2 border-accent-gold/30 pl-6">
                    "We believe finding your signature scent is an intimate journey that shouldn't be rushed."
                  </p>
                  <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8]">
                    This Discovery Set is our personal invitation for you to experience the poetry of our boutique atelier in the comfort of your own home, allowing each fragrance to interact beautifully with your unique skin chemistry.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Chapter 2: The Concept */}
            <Reveal yOffset={30}>
              <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                <div className="md:w-1/3 md:order-2">
                  <p className="text-[9px] tracking-[0.3em] uppercase font-sans font-medium text-foreground/40 border-b border-foreground/10 pb-4 text-left md:text-right">
                    Chapitre II
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mt-6 leading-tight text-left md:text-right">
                    The <br className="hidden md:block" />
                    <span className="italic">Concept</span>
                  </h3>
                </div>
                <div className="md:w-2/3 space-y-6 pt-2 md:order-1 text-left md:text-right">
                  <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8]">
                    You are in complete control of your exploration. Curate your own elegant box containing five 2ml glass vials of our signature extrait de parfums. 
                  </p>
                  <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8]">
                    Take your time to live with each scent, layer them, and let the different chapters of memories unfold naturally throughout your day.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Chapter 3: The Reward */}
            <Reveal yOffset={30}>
              <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                <div className="md:w-1/3">
                  <p className="text-[9px] tracking-[0.3em] uppercase font-sans font-medium text-foreground/40 border-b border-foreground/10 pb-4">
                    Chapitre III
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mt-6 leading-tight">
                    The <br className="hidden md:block" />
                    <span className="italic">Reward</span>
                  </h3>
                </div>
                <div className="md:w-2/3 space-y-6 pt-2">
                  <div className="p-8 bg-foreground/5 border border-foreground/10 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl pointer-events-none" />
                    <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8] relative z-10">
                      As a token of our deepest appreciation for trusting ARUTALA, every purchase of this set includes a complimentary digital voucher worth <strong className="font-serif italic font-normal text-xl">Rp 350.000</strong>. 
                    </p>
                    <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8] mt-4 relative z-10">
                      Whenever you are ready, use it towards your first full-size (100ml) bottle. Let your journey guide your next step.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      )}

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
              <div className="flex border-b border-cream">
                {(['details', 'ingredients', 'shipping'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      flex-1 py-4 text-center transition-all cursor-pointer relative text-[10px] tracking-[0.2em] uppercase font-sans
                      ${activeTab === tab ? 'text-foreground font-bold' : 'text-foreground/40 hover:text-foreground font-medium'}
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
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col justify-center space-y-1.5 p-3 bg-cream/5 border border-cream/30 hover:border-cream/70 transition-colors rounded-sm">
                      <div className="flex items-center space-x-1.5 text-[9px] uppercase tracking-wider text-foreground/40 font-semibold">
                        <FlaskConical size={10} />
                        <span>Concentration</span>
                      </div>
                      <span className="font-serif italic text-foreground font-medium text-[13px]">{product.concentration}</span>
                    </div>
                    <div className="flex flex-col justify-center space-y-1.5 p-3 bg-cream/5 border border-cream/30 hover:border-cream/70 transition-colors rounded-sm">
                      <div className="flex items-center space-x-1.5 text-[9px] uppercase tracking-wider text-foreground/40 font-semibold">
                        <Droplets size={10} />
                        <span>Volume</span>
                      </div>
                      <span className="font-mono text-foreground font-medium text-[13px] tracking-wide">{product.volume}</span>
                    </div>
                    <div className="flex flex-col justify-center space-y-1.5 p-3 bg-cream/5 border border-cream/30 hover:border-cream/70 transition-colors rounded-sm">
                      <div className="flex items-center space-x-1.5 text-[9px] uppercase tracking-wider text-foreground/40 font-semibold">
                        <MapPin size={10} />
                        <span>Origin</span>
                      </div>
                      <span className="font-serif italic text-foreground font-medium text-[13px]">Jakarta, Indonesia</span>
                    </div>
                    <div className="flex flex-col justify-center space-y-1.5 p-3 bg-cream/5 border border-cream/30 hover:border-cream/70 transition-colors rounded-sm">
                      <div className="flex items-center space-x-1.5 text-[9px] uppercase tracking-wider text-foreground/40 font-semibold">
                        <Package size={10} />
                        <span>Packaging</span>
                      </div>
                      <span className="text-foreground font-light text-[11px] leading-snug">Lead-free heavy clear glass flacon, hand-stamped label</span>
                    </div>
                  </div>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center pb-12 lg:pb-20 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="text-center transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
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
      
      {product.slug === 'discovery-set' && <ChatWidget />}
    </div>
  );
};
