import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MagneticButton } from './MagneticButton';
import { StaggerContainer, StaggerItem } from './Reveal';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll hooks
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, -100]); // slow image rise on scroll

  const handleExploreScroll = () => {
    const section = document.getElementById('featured-collection');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-background flex items-center pt-24 overflow-hidden border-b border-cream"
      id="hero-section"
    >
      {/* Decorative vertical lines and ambient lighting (subtle craftsmanship) */}
      <div className="absolute inset-y-0 left-12 w-[1px] bg-cream hidden md:block" />
      <div className="absolute inset-y-0 right-12 w-[1px] bg-cream hidden md:block" />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
        
        {/* Display Typography Headline (Centered) */}
        <div className="w-full space-y-8 flex flex-col justify-center items-center text-center relative z-10">
          <StaggerContainer delay={0.2} className="space-y-6 flex flex-col items-center">
            <StaggerItem yOffset={30}>
              <p className="text-[10px] tracking-[0.4em] uppercase font-sans font-medium text-gray-400 mb-2 block">
                La Collection d'Éternité · No. 01
              </p>
            </StaggerItem>

            <StaggerItem yOffset={40}>
              <h1 className="font-serif text-[44px] sm:text-[72px] lg:text-[96px] xl:text-[112px] leading-[0.95] font-light text-foreground tracking-tight mb-4">
                Sculpting <br className="md:hidden" />
                <span className="italic text-accent-gold">&</span> Invisible <br className="md:hidden" />
                Masterpieces.
              </h1>
            </StaggerItem>

            <StaggerItem yOffset={50}>
              <p className="text-sm md:text-base leading-relaxed font-light text-foreground/60 mb-8 max-w-xl text-center">
                Olfactive chapters composed in our boutique atelier, designed to capture fleeting feelings, Indonesian heritage, and modern silence in pure extrait.
              </p>
            </StaggerItem>

            <StaggerItem yOffset={60} className="pt-2">
              <div className="w-full sm:w-auto flex justify-center">
                <MagneticButton onClick={handleExploreScroll} className="min-w-[200px] w-full sm:w-auto">
                  Explore Scents
                </MagneticButton>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

      </div>

      {/* Elegant scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 pointer-events-none opacity-40">
        <span className="text-[8px] tracking-[0.25em] uppercase font-sans">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-10 bg-foreground"
        />
      </div>
    </section>
  );
};
