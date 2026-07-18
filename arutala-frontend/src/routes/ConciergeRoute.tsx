import React, { useEffect } from 'react';
import { Reveal, StaggerContainer, StaggerItem } from '../components/Reveal';
import { Truck, RefreshCw, Mail } from 'lucide-react';

export const ConciergeRoute: React.FC = () => {
  useEffect(() => {
    document.title = "Client Concierge — ARUTALA";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen pt-32 pb-24" id="concierge-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-24">
        
        {/* Header */}
        <Reveal yOffset={30}>
          <div className="text-center space-y-6">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-gray-400 font-medium">
              Client Services
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground tracking-tight">
              ARUTALA <span className="italic">Concierge</span>
            </h1>
            <p className="font-sans text-sm md:text-base text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
              We are dedicated to ensuring your experience is as seamless and elegant as the fragrances we craft. Below you will find details regarding shipping, returns, and how to reach our atelier.
            </p>
          </div>
        </Reveal>

        <StaggerContainer delay={0.2} className="space-y-16">
          
          {/* Shipping Policy */}
          <StaggerItem yOffset={20}>
            <div className="flex flex-col md:flex-row gap-8 items-start border-t border-foreground/10 pt-16">
              <div className="md:w-1/4 flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-cream/10 border border-foreground/10 flex items-center justify-center text-accent-gold">
                  <Truck size={20} strokeWidth={1.5} />
                </div>
                <h2 className="font-serif text-2xl text-foreground font-light">Shipping</h2>
              </div>
              <div className="md:w-3/4 space-y-6 font-sans text-sm md:text-base text-gray-500 font-light leading-relaxed pt-2">
                <p>
                  <span className="font-serif italic text-lg text-foreground">Complimentary Standard Delivery</span><br />
                  Complimentary standard shipping applies automatically to all domestic orders within Indonesia that exceed Rp 2.000.000.
                </p>
                <p>
                  Every order is meticulously assembled, hand-wrapped in our signature textured cream box, sealed with wax, and dispatched from our Jakarta atelier within 24 hours of purchase.
                </p>
                <p>
                  For expedited delivery or international inquiries, our couriers are carefully selected to ensure the safe, temperature-controlled transit of your flacon.
                </p>
              </div>
            </div>
          </StaggerItem>

          {/* Returns & Exchanges */}
          <StaggerItem yOffset={20}>
            <div className="flex flex-col md:flex-row gap-8 items-start border-t border-foreground/10 pt-16">
              <div className="md:w-1/4 flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-cream/10 border border-foreground/10 flex items-center justify-center text-accent-gold">
                  <RefreshCw size={20} strokeWidth={1.5} />
                </div>
                <h2 className="font-serif text-2xl text-foreground font-light">Returns</h2>
              </div>
              <div className="md:w-3/4 space-y-6 font-sans text-sm md:text-base text-gray-500 font-light leading-relaxed pt-2">
                <p>
                  <span className="font-serif italic text-lg text-foreground">14-Day Return Policy</span><br />
                  To ensure the integrity of our extrait de parfums, returns and exchanges are only accepted within 14 days of receipt for items that remain completely unopened, in their original cello-wrapped packaging.
                </p>
                <p>
                  Because fragrance interacts uniquely with individual body chemistry, we highly recommend purchasing the <a href="#/product/discovery" className="text-foreground border-b border-foreground/30 hover:border-foreground transition-colors">Discovery Set</a> to explore our collection before committing to a full-size 100ml flacon.
                </p>
              </div>
            </div>
          </StaggerItem>

          {/* Direct Support */}
          <StaggerItem yOffset={20}>
            <div className="flex flex-col md:flex-row gap-8 items-start border-t border-b border-foreground/10 py-16">
              <div className="md:w-1/4 flex flex-col items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-cream/10 border border-foreground/10 flex items-center justify-center text-accent-gold">
                  <Mail size={20} strokeWidth={1.5} />
                </div>
                <h2 className="font-serif text-2xl text-foreground font-light">Contact</h2>
              </div>
              <div className="md:w-3/4 space-y-6 font-sans text-sm md:text-base text-gray-500 font-light leading-relaxed pt-2">
                <p>
                  Should you require assistance with an existing order, olfactory guidance, or bespoke gifting services, our concierge team is at your disposal.
                </p>
                <p className="font-serif italic text-xl text-foreground">
                  concierge@arutala.com
                </p>
                <p className="text-xs text-foreground/40">
                  Please allow up to 24 hours for a personalized response from our team.
                </p>
              </div>
            </div>
          </StaggerItem>

        </StaggerContainer>

      </div>
    </div>
  );
};
