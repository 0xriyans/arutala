import React from 'react';
import { useToast } from '../context/toast-context';

export const Footer: React.FC = () => {
  const { addToast } = useToast();
  
  const navigateTo = (hash: string) => {
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-cream/20 border-t border-cream py-16 md:py-20 select-none" id="site-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col space-y-16">
        
        {/* Main Grid: 3 columns of links + Branding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Col */}
          <div className="flex flex-col space-y-4 md:col-span-1">
            <h4 className="font-serif italic text-xl font-normal text-foreground">ARUTALA</h4>
            <p className="text-xs text-gray-400 font-sans font-light leading-relaxed max-w-xs">
              A private, single-brand fragrance house dedicated to capturing the raw poetry of silence.
            </p>
          </div>

          {/* Links Column 1: Shop */}
          <div className="flex flex-col space-y-4">
            <h5 className="text-[10px] tracking-[0.25em] uppercase font-sans text-gray-400 font-semibold">
              The Collections
            </h5>
            <ul className="space-y-2 text-xs font-sans text-gray-500 font-light">
              <li>
                <button onClick={() => navigateTo('#/shop')} className="hover:text-foreground transition-colors cursor-pointer">
                  All Fragrances
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigateTo('#/');
                    setTimeout(() => {
                      const el = document.getElementById('featured-collection');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 200);
                  }}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Floral Profiles
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigateTo('#/');
                    setTimeout(() => {
                      const el = document.getElementById('featured-collection');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 200);
                  }}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Woody Profiles
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigateTo('#/');
                    setTimeout(() => {
                      const el = document.getElementById('featured-collection');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 200);
                  }}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Citrus Profiles
                </button>
              </li>
            </ul>
          </div>

          {/* Links Column 2: House */}
          <div className="flex flex-col space-y-4">
            <h5 className="text-[10px] tracking-[0.25em] uppercase font-sans text-gray-400 font-semibold">
              The House
            </h5>
            <ul className="space-y-2 text-xs font-sans text-gray-500 font-light">
              <li>
                <button onClick={() => navigateTo('#/about')} className="hover:text-foreground transition-colors cursor-pointer">
                  Our Story
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('#/about')} className="hover:text-foreground transition-colors cursor-pointer">
                  Harvesting & Craft
                </button>
              </li>
              <li>
                <a href="#brand-story-strip" className="hover:text-foreground transition-colors">
                  Distillery Locations
                </a>
              </li>
              <li>
                <a href="#newsletter-section" className="hover:text-foreground transition-colors">
                  Journal
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Concierge */}
          <div className="flex flex-col space-y-4">
            <h5 className="text-[10px] tracking-[0.25em] uppercase font-sans text-gray-400 font-semibold">
              Concierge
            </h5>
            <ul className="space-y-2 text-xs font-sans text-gray-500 font-light">
              <li>
                <span className="text-gray-400 font-medium">Direct Support:</span>
                <p className="font-mono text-[11px] text-gray-500">concierge@arutala.com</p>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('#/concierge')}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Complimentary Shipping
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('#/concierge')}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('#/care')}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  Flacon Care Guide
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('#/track-order')} className="hover:text-foreground transition-colors cursor-pointer text-accent-gold">
                  Track Guest Order
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Wordmark logo, social icons, copyrights */}
        <div className="pt-12 border-t border-cream flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-serif text-2xl tracking-[0.25em] uppercase text-gray-300 select-none">
            ARUTALA
          </p>

          <div className="flex flex-col md:items-end space-y-2 text-center md:text-right">
            <p className="text-[10px] text-gray-400 font-sans tracking-wider font-light">
              All compositions distilled and filled by hand.
            </p>
            <p className="text-[9px] text-gray-300 font-sans tracking-wide">
              ARUTALA © 2026. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
