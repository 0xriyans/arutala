import React from 'react';
import { Reveal } from './Reveal';

export const PressVoices: React.FC = () => {
  return (
    <section className="bg-background py-24 md:py-32 border-t border-b border-foreground/10" id="press-voices-section">
      <div className="max-w-5xl mx-auto px-6 text-center space-y-16">
        
        {/* Header */}
        <Reveal duration={0.8} yOffset={20}>
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-foreground/20" />
            <p className="text-[9px] tracking-[0.4em] uppercase font-sans font-medium text-foreground/40">
              Press & Voices
            </p>
            <div className="w-8 h-[1px] bg-foreground/20" />
          </div>
        </Reveal>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          
          {/* Quote 1 */}
          <Reveal delay={0.1} duration={0.8} yOffset={30}>
            <div className="space-y-6">
              <p className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-foreground font-light leading-relaxed">
                "A masterpiece of modern Indonesian perfumery."
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-foreground/60 border-t border-foreground/10 pt-4 inline-block">
                — Vogue
              </p>
            </div>
          </Reveal>

          {/* Quote 2 */}
          <Reveal delay={0.2} duration={0.8} yOffset={30}>
            <div className="space-y-6">
              <p className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-foreground font-light leading-relaxed">
                "Senja captures the exact warmth of a tropical dusk."
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-foreground/60 border-t border-foreground/10 pt-4 inline-block">
                — Editor's Choice
              </p>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};
