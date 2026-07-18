import React from 'react';
import { Hero } from '../components/Hero';
import { EditorialProductList } from '../components/EditorialProductList';
import { FragranceNotes } from '../components/FragranceNotes';
import { ScentStory } from '../components/ScentStory';
import { BrandStory } from '../components/BrandStory';
import { NewsletterSubscribe } from '../components/NewsletterSubscribe';
import { products } from '../data/products';
import { Reveal } from '../components/Reveal';
import { MagneticButton } from '../components/MagneticButton';
import { FragranceQuiz } from '../components/FragranceQuiz';

export const HomeRoute: React.FC = () => {
  // Let's use Aksara as our reference specimen for the home page Fragrance Notes Showcase
  const showcaseProduct = products.find((p) => p.slug === 'aksara') || products[0] || {
    name: 'Loading...',
    family: '...',
    notes: { top: [], heart: [], base: [] },
    noteDescriptions: {}
  } as any;

  const handleNavigateToShop = () => {
    window.location.hash = '#/shop';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-0" id="home-route-page">
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Featured Collection Grid */}
      <section className="bg-background py-24 md:py-32" id="featured-collection">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium text-foreground/40">
                L'Édition Permanente
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight">
                Featured Olfactory Compositions
              </h2>
            </div>
            
            <button
              onClick={handleNavigateToShop}
              className="text-xs tracking-[0.2em] uppercase font-sans font-medium text-foreground border-b border-foreground/20 pb-1 hover:border-foreground transition-all duration-300 hidden md:block"
            >
              View All Works
            </button>
          </div>

          {/* Editorial layout for featured products (no scroll locking) */}
          <div className="-mx-6 md:-mx-12 mt-12 overflow-hidden border-y border-cream/10">
            <EditorialProductList limit={3} isFeaturedOnly={true} />
          </div>

          <div className="flex justify-center pt-8 md:hidden">
            <MagneticButton onClick={handleNavigateToShop} className="w-full sm:w-auto">
              View All Compositions
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* 3. Fragrance Notes Breakdown Section */}
      <section className="bg-muted/50 py-24 md:py-32 border-t border-b border-foreground/5" id="olfactory-architecture">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Specimen details */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <Reveal duration={0.8} yOffset={25}>
              <p className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium text-foreground/40">
                L'Anatomie du Parfum
              </p>
            </Reveal>

            <Reveal delay={0.1} duration={0.8} yOffset={25}>
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-tight tracking-tight">
                The Architecture <br />
                of a <span className="italic font-normal">Scent Signature</span>
              </h3>
            </Reveal>

            <Reveal delay={0.2} duration={0.8} yOffset={25} className="space-y-4 text-foreground/70 font-sans font-light text-sm sm:text-base leading-relaxed">
              <p>
                A perfume is a three-act play. Notes unfold sequentially, responding to skin temperature and exposure. The top note greets you like a spark; the heart note forms the emotional message; the base notes dry down to form a permanent sensory signature.
              </p>
              <p>
                Interact with the composition of our flagship scent, <strong className="font-serif italic font-normal text-foreground">{showcaseProduct.name}</strong>, below to discover its molecular layout.
              </p>
            </Reveal>

            <Reveal delay={0.3} duration={0.8} yOffset={25} className="pt-4 flex items-center space-x-6">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-sans font-semibold">Active Specimen</span>
                <p className="font-serif italic text-lg text-foreground font-medium">{showcaseProduct.name}</p>
              </div>
              <div className="w-[1px] h-12 bg-foreground/15" />
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-sans font-semibold">Profile</span>
                <p className="font-serif italic text-lg text-foreground font-medium">{showcaseProduct.family} Woody</p>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Notes Widget */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <Reveal delay={0.2} duration={0.8} yOffset={30}>
              <FragranceNotes
                notes={showcaseProduct.notes}
                noteDescriptions={showcaseProduct.noteDescriptions}
              />
            </Reveal>
          </div>

        </div>
      </section>

      {/* Scent Stories Poetic Narrative Section */}
      <ScentStory />

      {/* Interactive Scent Consultation / Fragrance Quiz Finder */}
      <FragranceQuiz />

      {/* 4. Brand Craftsmanship Story Strip */}
      <BrandStory />

      {/* 5. Newsletter Signup */}
      <NewsletterSubscribe />
    </div>
  );
};
