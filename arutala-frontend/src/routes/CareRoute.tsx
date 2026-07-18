import React, { useEffect } from 'react';
import { Reveal, StaggerContainer, StaggerItem } from '../components/Reveal';
import { ParallaxImage } from '../components/ParallaxImage';
import { Sun, Droplet, Wind, Sparkles } from 'lucide-react';

export const CareRoute: React.FC = () => {
  useEffect(() => {
    document.title = "Flacon Care Guide — ARUTALA";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen pt-32 pb-24" id="care-guide-page">
      <div className="max-w-5xl mx-auto px-6 md:px-12 space-y-24">
        
        {/* Header */}
        <Reveal yOffset={30}>
          <div className="text-center space-y-6">
            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-gray-400 font-medium">
              Olfactive Preservation
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground tracking-tight">
              Flacon <span className="italic">Care</span> Guide
            </h1>
            <p className="font-sans text-sm md:text-base text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
              Our extrait de parfums are living botanical compositions. Like fine wine, they require a stable environment to preserve their intricate molecular structure and mature gracefully over time.
            </p>
          </div>
        </Reveal>

        {/* Hero Image */}
        <Reveal duration={1.0}>
          <div className="w-full aspect-[21/9] bg-cream/20 relative overflow-hidden border border-foreground/5 shadow-sm">
            <ParallaxImage 
              src="https://images.unsplash.com/photo-1616604847422-77983617fcbd?auto=format&fit=crop&q=80&w=2000"
              alt="Light filtering through amber glass"
              intensity={30}
              className="w-full h-full object-cover"
            />
          </div>
        </Reveal>

        {/* Care Instructions Grid */}
        <StaggerContainer delay={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-b border-foreground/10 py-16">
          
          <StaggerItem yOffset={20} className="space-y-4">
            <div className="w-10 h-10 border border-foreground/10 rounded-full flex items-center justify-center text-accent-gold bg-cream/10">
              <Sun size={18} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-foreground font-medium">Light Control</h3>
            <p className="font-sans text-sm text-gray-500 leading-relaxed font-light">
              Direct UV rays will break down the delicate volatile oils. Always store your flacon away from windows or direct sunlight. A shaded vanity or its original embossed box is ideal.
            </p>
          </StaggerItem>

          <StaggerItem yOffset={20} className="space-y-4">
            <div className="w-10 h-10 border border-foreground/10 rounded-full flex items-center justify-center text-accent-gold bg-cream/10">
              <Droplet size={18} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-foreground font-medium">Temperature</h3>
            <p className="font-sans text-sm text-gray-500 leading-relaxed font-light">
              Extreme heat and humidity degrade perfume rapidly. Keep your fragrance at a stable room temperature. Never store it in the bathroom, where shower steam causes severe fluctuations.
            </p>
          </StaggerItem>

          <StaggerItem yOffset={20} className="space-y-4">
            <div className="w-10 h-10 border border-foreground/10 rounded-full flex items-center justify-center text-accent-gold bg-cream/10">
              <Wind size={18} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-foreground font-medium">Oxidation</h3>
            <p className="font-sans text-sm text-gray-500 leading-relaxed font-light">
              Keep the magnetic wooden cap securely fastened when not in use. Minimizing air exposure preserves the delicate top notes like citrus and ozone from prematurely oxidizing.
            </p>
          </StaggerItem>

          <StaggerItem yOffset={20} className="space-y-4">
            <div className="w-10 h-10 border border-foreground/10 rounded-full flex items-center justify-center text-accent-gold bg-cream/10">
              <Sparkles size={18} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl text-foreground font-medium">Flacon Polishing</h3>
            <p className="font-sans text-sm text-gray-500 leading-relaxed font-light">
              Our lead-free glass can gather fingerprints. To maintain its pristine appearance, gently wipe the exterior with a dry, soft microfiber cloth. Avoid using any chemical glass cleaners.
            </p>
          </StaggerItem>

        </StaggerContainer>

      </div>
    </div>
  );
};
