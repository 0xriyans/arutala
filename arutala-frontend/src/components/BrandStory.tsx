import React from 'react';
import { Reveal } from './Reveal';
import { ParallaxImage } from './ParallaxImage';
import craftedImg from '../../assets/images/crafted.png';

export const BrandStory: React.FC = () => {
  return (
    <section className="bg-background border-t border-b border-foreground/10 py-24 md:py-32 relative overflow-hidden" id="brand-story-strip">
      {/* Absolute decorative geometry */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-foreground/[0.01] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Column: Atmospheric image depicting master distillation */}
          <div className="w-full lg:w-1/2">
            <Reveal duration={1.0} yOffset={40}>
              <div className="relative aspect-[4/5] bg-background border border-cream shadow-sm overflow-hidden group">
                <ParallaxImage
                  src={craftedImg}
                  alt="Distillation of raw ingredients in our Jakarta atelier"
                  intensity={40}
                  className="w-full h-full"
                  zoomClassName="transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                />
                
                {/* Visual quote stamp in the corner */}
                <div className="absolute top-6 right-6 z-10 bg-background/95 backdrop-blur-md p-4 max-w-[150px] border border-cream hidden sm:block">
                  <p className="text-[8px] tracking-[0.2em] uppercase font-sans text-gray-400 font-semibold mb-1">
                    Jakarta, ID
                  </p>
                  <p className="font-serif italic text-xs text-foreground/80 leading-normal">
                    "Perfume is a poem written in light and shadow."
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Poetic story text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-8">
            <Reveal delay={0.2} duration={0.8}>
              <p className="text-[10px] tracking-[0.4em] uppercase font-sans font-medium text-gray-400">
                L'Origine du Parfum
              </p>
            </Reveal>

            <Reveal delay={0.3} duration={0.8}>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-tight tracking-tight">
                Crafted in Silence. <br />
                <span className="italic font-normal">Remembered</span> Forever.
              </h2>
            </Reveal>

            <Reveal delay={0.4} duration={0.8} className="space-y-6 text-gray-500 font-sans font-light text-sm sm:text-base leading-relaxed">
              <p>
                Arutala was founded on a simple, singular premise: that the most profound memories reside in the quiet details of scent. Our fragrance house eschews the mass, the loud, and the temporary. We exist solely to restore perfume to its purest form as an architectural, emotional medium.
              </p>
              <p>
                Every single flacon contains botanical oils hand-distilled from blooms harvested at dawn across the Indonesian archipelago and matured in our boutique atelier. By pairing classical harvesting cycles with advanced molecular fractionation, our nose coaxes rare, velvety accents from raw sandalwood, wild jasmine, and ancient ambers.
              </p>
            </Reveal>

            {/* Micro Details (Signature values) */}
            <Reveal delay={0.5} duration={0.8} className="grid grid-cols-2 gap-6 pt-6 border-t border-cream">
              <div className="space-y-1">
                <h4 className="font-serif italic text-base text-foreground font-medium">98% Botanical</h4>
                <p className="text-[10px] tracking-wide font-sans text-gray-400 uppercase">
                  Zero synthetics additives or fillers.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-serif italic text-base text-foreground font-medium">Numbered Batches</h4>
                <p className="text-[10px] tracking-wide font-sans text-gray-400 uppercase">
                  Only 300 bottles produced per season.
                </p>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};
