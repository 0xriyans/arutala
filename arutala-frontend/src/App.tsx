import React, { useEffect, useState } from 'react';
import { fetchProducts, isProductsLoaded } from './data/products';
import { CartProvider } from './context/cart-context';
import { AuthProvider } from './context/auth-context';
import { ToastProvider } from './context/toast-context';
import { SiteHeader } from './components/SiteHeader';
import { ToastContainer } from './components/ToastContainer';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { HomeRoute } from './routes/HomeRoute';
import { ShopRoute } from './routes/ShopRoute';
import { AboutRoute } from './routes/AboutRoute';
import { ProductDetailRoute } from './routes/ProductDetailRoute';
import { DiscoverySetRoute } from './routes/DiscoverySetRoute';
import { CareRoute } from './routes/CareRoute';
import { ConciergeRoute } from './routes/ConciergeRoute';
import { AdminRoute } from './routes/AdminRoute';
import { LoginRoute } from './routes/LoginRoute';
import { RegisterRoute } from './routes/RegisterRoute';
import { TrackOrderRoute } from './routes/TrackOrderRoute';
import { ProfileRoute } from './routes/ProfileRoute';
import { PaymentRoute } from './routes/PaymentRoute';
import { ForgotPasswordRoute } from './routes/ForgotPasswordRoute';
import { ResetPasswordRoute } from './routes/ResetPasswordRoute';
import { ChatWidget } from './components/ChatWidget';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollProgress } from './components/ScrollProgress';
import { CustomCursor } from './components/CustomCursor';
import { ThemeProvider } from './context/theme-context';
import { Preloader } from './components/Preloader';

export default function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
  const [productsReady, setProductsReady] = useState(false);

  // Watch for URL hash updates
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(prev => {
        const newHash = window.location.hash || '#/';
        const basePrev = prev.split('?')[0];
        const baseNew = newHash.split('?')[0];
        
        // Scroll to top only if the base route changes
        if (basePrev !== baseNew && !newHash.includes('featured-collection') && !newHash.includes('brand-story')) {
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        }
        return newHash;
      });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch products from API on app startup
  useEffect(() => {
    fetchProducts().then(() => setProductsReady(true));
  }, []);

  // Simple Router Switcher
  const renderRoute = () => {
    if (currentHash === '#/' || currentHash === '') {
      return <HomeRoute />;
    }
    if (currentHash.startsWith('#/shop')) {
      return <ShopRoute />;
    }
    if (currentHash === '#/about') {
      return <AboutRoute />;
    }
    if (currentHash === '#/admin') {
      return <AdminRoute />;
    }
    if (currentHash === '#/login') {
      return <LoginRoute />;
    }
    if (currentHash === '#/register') {
      return <RegisterRoute />;
    }
    if (currentHash === '#/track-order') {
      return <TrackOrderRoute />;
    }
    if (currentHash === '#/profile') {
      return <ProfileRoute />;
    }
    if (currentHash.startsWith('#/payment')) {
      return <PaymentRoute />;
    }
    if (currentHash.startsWith('#/forgot-password')) {
      return <ForgotPasswordRoute />;
    }
    if (currentHash.startsWith('#/reset-password')) {
      return <ResetPasswordRoute />;
    }
    
    if (currentHash === '#/product/discovery' || currentHash === '#/product/discovery-set') {
      return <ProductDetailRoute slug="discovery-set" />;
    }

    if (currentHash === '#/care') {
      return <CareRoute />;
    }

    if (currentHash === '#/concierge') {
      return <ConciergeRoute />;
    }
    
    // Match product detail slugs: #/product/l-ambre-nu
    const productMatch = currentHash.match(/^#\/product\/([^/?]+)/);
    if (productMatch) {
      const slug = productMatch[1];
      return <ProductDetailRoute slug={slug} />;
    }

    // Default fallback to home
    return <HomeRoute />;
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <div className="bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-accent-gold selection:text-background transition-colors duration-500">
          
          {/* Initial Loading Screen */}
          <Preloader />
        
        {/* Elegant lagging custom cursor */}
        <CustomCursor />

        {/* Subtle top-of-viewport scroll progress bar */}
        <ScrollProgress />

        {/* Global Floating Site Header */}
        <SiteHeader />

        {/* Page Container with Route Transition animations */}
        <main className="flex-grow flex flex-col">
          <AnimatePresence mode="wait">
            {productsReady && (
              <motion.div
                key={currentHash.startsWith('#/shop') ? '#/shop' : currentHash}
                initial={{ 
                  opacity: 0,
                  y: 15,
                  filter: 'blur(4px)'
                }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)'
                }}
                exit={{ 
                  opacity: 0,
                  y: -15,
                  filter: 'blur(4px)'
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className="flex-grow flex flex-col origin-center"
              >
              {renderRoute()}
            </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Slide-out Cart Drawer */}
        <CartDrawer />

        {/* Global Minimalist Footer */}
        <Footer />
        <ToastContainer />
        {(currentHash === '#/' || currentHash === '') && <ChatWidget />}
          </div>
        </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
