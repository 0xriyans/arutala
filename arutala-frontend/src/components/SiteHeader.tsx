import React, { useEffect, useState } from 'react';
import { Menu, X, ShoppingBag, Search, Compass, User, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/cart-context';
import { useAuth } from '../context/auth-context';
import { useTheme } from '../context/theme-context';
import { motion, AnimatePresence } from 'motion/react';
import { products, formatRupiah } from '../data/products';

export const SiteHeader: React.FC = () => {
  const { openCart, cartCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');

  // Listen for scroll to fade header background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for hash change for active link highlighting
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  const filteredProductsForSearch = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes.top.some(n => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.notes.heart.some(n => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.notes.base.some(n => n.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out border-b
          ${isScrolled 
            ? 'bg-background/70 backdrop-blur-xl py-4 border-foreground/10 shadow-[0_1px_10px_rgba(0,0,0,0.01)]' 
            : 'bg-transparent py-6 border-transparent'
          }
        `}
        id="site-header"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Desktop Navigation (Left) */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10 flex-1">
            <button
              onClick={() => navigateTo('#/shop')}
              className={`text-[10px] tracking-[0.25em] uppercase font-sans font-medium transition-colors hover:text-foreground relative pb-1 group`}
            >
              Shop
              <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-foreground transition-transform duration-300 origin-left ${currentHash === '#/shop' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>
            <button
              onClick={() => {
                navigateTo('#/');
                setTimeout(() => {
                  const el = document.getElementById('featured-collection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-[10px] tracking-[0.25em] uppercase font-sans font-medium text-foreground/60 transition-colors hover:text-foreground relative pb-1 group"
            >
              Collections
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-foreground transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
            </button>
            <button
              onClick={() => navigateTo('#/about')}
              className={`text-[10px] tracking-[0.25em] uppercase font-sans font-medium transition-colors hover:text-foreground relative pb-1 group`}
            >
              Story
              <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-foreground transition-transform duration-300 origin-left ${currentHash === '#/about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>
            <button
              onClick={() => navigateTo('#/product/discovery')}
              className={`text-[10px] tracking-[0.25em] uppercase font-sans font-medium text-accent-gold transition-colors hover:opacity-80 relative pb-1 group`}
            >
              Discovery
              <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-accent-gold transition-transform duration-300 origin-left ${currentHash === '#/product/discovery' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>

          </nav>

          {/* Mobile Hamburger (Left) */}
          <div className="flex md:hidden flex-1 justify-start">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-foreground/80 hover:text-foreground transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Centered Wordmark */}
          <div className="flex-shrink-0 text-center">
            <button
              onClick={() => navigateTo('#/')}
              className="font-serif text-lg md:text-xl tracking-[0.35em] uppercase text-foreground select-none font-medium hover:opacity-80 transition-opacity"
            >
              ARUTALA
            </button>
          </div>

          {/* Right Icons (Search + Cart Bag) */}
          <div className="flex items-center justify-end space-x-1 md:space-x-6 flex-1 text-foreground">
            {/* Profile Icon */}
            <button
              onClick={() => navigateTo(isAuthenticated ? '#/profile' : '#/login')}
              className="hidden md:flex p-1 hover:scale-105 transition-transform duration-200 cursor-pointer text-foreground/80 hover:text-foreground"
              aria-label="Profile"
            >
              <User size={18} />
            </button>

            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:scale-105 transition-transform duration-200 cursor-pointer text-foreground/80 hover:text-foreground"
              aria-label="Search fragrances"
            >
              <Search size={18} />
            </button>

            {/* Theme Toggle Icon */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex p-1 hover:scale-105 transition-transform duration-200 cursor-pointer text-foreground/80 hover:text-foreground relative w-6 h-6 items-center justify-center overflow-hidden"
              aria-label="Toggle dark mode"
            >
              <div className={`absolute transition-transform duration-500 ${theme === 'dark' ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              </div>
              <div className={`absolute transition-transform duration-500 ${theme === 'light' ? '-translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              </div>
            </button>

            {/* Bag Icon */}
            <button
              onClick={openCart}
              className="p-2 -mr-2 flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 cursor-pointer relative"
              aria-label="Open bag"
            >
              <ShoppingBag size={18} className="text-foreground/80 hover:text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-foreground text-cream font-mono text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation (Slide-in from Left) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm cursor-pointer"
            />

            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-full max-w-[280px] bg-background p-8 flex flex-col justify-between border-r border-cream shadow-2xl"
            >
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <span className="font-serif italic text-lg text-foreground font-light">Arutala</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav className="flex flex-col space-y-6">
                  <button
                    onClick={() => navigateTo('#/')}
                    className="text-left font-serif text-2xl hover:italic hover:text-accent duration-200 transition-all"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => navigateTo('#/shop')}
                    className="text-left font-serif text-2xl hover:italic hover:text-accent duration-200 transition-all"
                  >
                    The Collection
                  </button>
                  <button
                    onClick={() => navigateTo('#/about')}
                    className="text-left font-serif text-2xl hover:italic hover:text-accent duration-200 transition-all"
                  >
                    Our Craft
                  </button>
                  <button
                    onClick={() => navigateTo('#/product/discovery')}
                    className="text-left font-serif text-2xl hover:italic text-accent-gold duration-200 transition-all"
                  >
                    Discovery
                  </button>
                  <button
                    onClick={() => navigateTo('#/track-order')}
                    className="text-left font-serif text-2xl hover:italic hover:text-accent duration-200 transition-all"
                  >
                    Track Order
                  </button>

                  {isAuthenticated ? (
                    <button
                      onClick={() => navigateTo('#/profile')}
                      className="text-left font-serif text-2xl hover:italic hover:text-accent duration-200 transition-all"
                    >
                      My Profile
                    </button>
                  ) : (
                    <button
                      onClick={() => navigateTo('#/login')}
                      className="text-left font-serif text-2xl hover:italic hover:text-accent duration-200 transition-all"
                    >
                      Login
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById('featured-collection');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-left font-serif text-2xl hover:italic hover:text-accent duration-200 transition-all"
                  >
                    Fragrance Families
                  </button>
                  
                  <div className="mt-8 pt-8 border-t border-cream">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.2em] font-sans font-medium uppercase text-foreground/40">
                        Night Mode
                      </span>
                      <button
                        onClick={toggleTheme}
                        className="p-2 border border-cream rounded-full hover:bg-foreground/5 transition-colors text-foreground flex items-center justify-center"
                        aria-label="Toggle dark mode"
                      >
                        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                      </button>
                    </div>
                  </div>
                </nav>
              </div>

              {/* Bottom footer in drawer */}
              <div className="space-y-4">
                <p className="text-[10px] tracking-widest uppercase text-foreground/40 font-sans">
                  COMPLIMENTARY SHIPPING
                </p>
                <div className="h-[1px] bg-cream w-full" />
                <p className="text-[10px] text-foreground/40 font-sans font-light">
                  ARUTALA © 2026. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Minimal Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
            id="search-overlay"
          >
            {/* Header for Search */}
            <div className="p-6 md:px-12 flex items-center justify-between border-b border-cream">
              <span className="font-serif italic text-lg text-foreground font-light">Olfactive Search</span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-full transition-all"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input Area */}
            <div className="max-w-3xl mx-auto w-full px-6 py-12 md:py-20 flex-1 flex flex-col space-y-12">
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground/30" size={24} />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search by note, collection, or ingredient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim() !== '') {
                      setIsSearchOpen(false);
                      navigateTo(`#/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  className="w-full bg-transparent border-b border-foreground/20 pl-10 pr-4 py-4 text-lg md:text-2xl font-serif focus:outline-none focus:border-foreground transition-all duration-300 placeholder-foreground/20 text-foreground"
                />
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto max-h-[50vh] custom-scrollbar">
                {searchQuery.trim() === '' ? (
                  <div className="space-y-6">
                    <h4 className="text-[10px] tracking-widest uppercase font-sans text-foreground/40 font-medium">
                      Trending Searches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Sandalwood', 'Rose', 'Fig', 'Amber', 'Citrus', 'Woody'].map((trend) => (
                        <button
                          key={trend}
                          onClick={() => setSearchQuery(trend)}
                          className="px-4 py-2 bg-cream/40 border border-cream hover:bg-cream hover:border-accent-gold/40 text-xs font-sans text-foreground transition-all duration-300 rounded-none cursor-pointer"
                        >
                          {trend}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-cream pb-3" id="search-results-summary-row">
                      <h4 className="text-[10px] tracking-widest uppercase font-sans text-foreground/40 font-medium">
                        Found {filteredProductsForSearch.length} Fragrances
                      </h4>
                      {searchQuery.trim() !== '' && (
                        <button
                          onClick={() => {
                            setIsSearchOpen(false);
                            navigateTo(`#/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                          }}
                          className="text-[10px] tracking-widest uppercase font-sans font-medium text-foreground hover:text-accent-gold transition-colors underline cursor-pointer"
                          id="view-all-shop-btn"
                        >
                          View all in Boutique
                        </button>
                      )}
                    </div>
                    
                    {filteredProductsForSearch.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredProductsForSearch.map((product) => (
                          <div
                            key={product.slug}
                            onClick={() => {
                              navigateTo(`#/product/${product.slug}`);
                            }}
                            className="flex space-x-4 p-3 hover:bg-cream/20 cursor-pointer transition-all duration-300 group"
                          >
                            <div className="w-16 h-20 bg-cream overflow-hidden flex-shrink-0">
                              <img
                                src={product.images.primary}
                                alt={product.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex flex-col justify-center">
                              <h5 className="font-serif text-base text-foreground font-medium group-hover:underline">
                                {product.name}
                              </h5>
                              <p className="text-xs font-sans text-foreground/60">
                                {product.family} · {product.subtitle}
                              </p>
                              <p className="text-xs font-mono text-foreground font-medium mt-1">
                                {formatRupiah(product.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                        <Compass className="text-foreground/30 animate-pulse" size={32} />
                        <p className="font-serif italic text-lg text-foreground/60">No matching olfactive path found.</p>
                        <p className="text-xs text-foreground/40 max-w-xs">
                          Try searching for main note ingredients like "Amber", "Saffron", "Tuberose", or "Bergamot".
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
