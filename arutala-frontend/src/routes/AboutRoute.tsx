import React, { useEffect, useState } from 'react';
import { Reveal } from '../components/Reveal';
import { motion } from 'motion/react';
import { Plus, Minus, HelpCircle, Mail, Clock, Compass, Flame, Leaf, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { ParallaxImage } from '../components/ParallaxImage';
import { Product, products, fetchProducts, isProductsLoaded } from '../data/products';

interface FAQItem {
  question: string;
  answer: string;
  category: 'shipping' | 'returns' | 'storage' | 'formulation';
}

interface JourneyMilestone {
  year: string;
  title: string;
  scentHighlight: string;
  category: string;
}

const journeyData: JourneyMilestone[] = [
  { year: "2018", title: "Rintik", scentHighlight: "First trial extractions of Indonesian Petrichor", category: "Genesis" },
  { year: "2020", title: "Segara", scentHighlight: "Redefining marine ambergris", category: "The First Opus" },
  { year: "2022", title: "Kala", scentHighlight: "Wild Oud and Mysore Sandalwood", category: "Exotics" },
  { year: "2024", title: "Puspa", scentHighlight: "Dawn-harvested Jasmin Sambac", category: "Modern Craft" },
  { year: "2026", title: "Fajar", scentHighlight: "Invigorating morning vetiver", category: "Future" }
];

const getYearIcon = (year: string) => {
  switch (year) {
    case '2018': return <Compass size={14} />;
    case '2020': return <Flame size={14} />;
    case '2022': return <Leaf size={14} />;
    case '2024': return <Clock size={14} />;
    case '2026': return <Sparkles size={14} />;
    default: return <Sparkles size={14} />;
  }
};

const faqData: FAQItem[] = [
  {
    category: 'shipping',
    question: "How is my Arutala order shipped, and what are the rates?",
    answer: "We believe the luxury experience should begin at dispatch. We offer complimentary insured express shipping across Indonesia on all boutique orders. Each order is meticulously hand-packed in our minimalist signature presentation box, wrapped in delicate silk tissue, and dispatched from our Jakarta atelier within 1–2 business days. Expected delivery times are 2–4 business days depending on your province."
  },
  {
    category: 'shipping',
    question: "Do you ship internationally?",
    answer: "Currently, we ship exclusively within Indonesia. We are working on expanding our logistics network to share our hand-crafted olfactory creations with patrons worldwide in the near future."
  },
  {
    category: 'returns',
    question: "Can I return a fragrance if it is not my signature scent?",
    answer: "Because scent is highly personal, every 100ml bottle purchase includes a complimentary 2ml trial vial of the same fragrance. We invite you to explore the sample on your skin before opening the sealed full-size bottle. If the scent does not resonate with you, we accept returns or exchanges of the unopened, sealed full-size bottle within 14 days of delivery. Due to safety and hygiene standards, we cannot accept returns on opened bottles."
  },
  {
    category: 'storage',
    question: "How should I store my bottle to preserve its olfactory composition?",
    answer: "To protect the delicate natural botanical oils and noble extracts from degradation, keep your bottle away from direct sunlight, high humidity, and extreme temperatures. We recommend storing it in a cool, dark drawer, wardrobe, or inside its original protective presentation box. Avoid storing perfume in the bathroom, where humidity and temperature fluctuate rapidly."
  },
  {
    category: 'formulation',
    question: "Why does the color of my fragrance look slightly different from a previous bottle?",
    answer: "We formulate with exceptionally high concentrations of raw, hand-harvested botanical extracts. Much like a fine wine vintage, natural harvests of jasmine, rose, or sandalwood are influenced by seasonal rainfall, soil conditions, and morning temperatures. These subtle natural variations can result in slight color shifts or deeper sediment aging over time, which is the ultimate mark of authentic, living botanical perfumery."
  },
  {
    category: 'formulation',
    question: "How long will these fragrances linger on my skin?",
    answer: "Our creations are formulated at Eau de Parfum and Extrait de Parfum concentrations (ranging from 15% to 22% pure scent oil). On average, you can expect our fragrances to project beautifully for 6 to 8 hours. Richer compositions in our Woody collection—such as L'Ambre Nu and Oud Imperial—will often linger on the skin or garments for over 12 hours due to their heavy resinous base notes."
  }
];

export const AboutRoute: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'shipping' | 'returns' | 'storage' | 'formulation'>('all');
  const [activeMilestone, setActiveMilestone] = useState<number>(0);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  // Set unique page header details on mount
  useEffect(() => {
    document.title = "Our Story — ARUTALA";
    window.scrollTo({ top: 0 });

    const loadProducts = async () => {
      if (!isProductsLoaded()) {
        await fetchProducts();
      }
      setLocalProducts([...products]);
    };
    loadProducts();

    const handleUpdate = () => setLocalProducts([...products]);
    window.addEventListener('maison-products-updated', handleUpdate);
    return () => window.removeEventListener('maison-products-updated', handleUpdate);
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqData.filter(
    item => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="bg-background min-h-screen pb-16 md:pb-24" id="about-route-page">
      
      {/* Pure Typography Cinematic Hero */}
      <div className="relative w-full min-h-[100dvh] flex items-center justify-center border-b border-foreground/5 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 md:w-96 md:h-96 bg-accent-gold/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
        
        <div className="text-center w-full space-y-6 md:space-y-8 px-4 md:px-6 max-w-4xl relative z-10">
          <Reveal className="flex flex-col items-center w-full">
            <div className="inline-flex items-center gap-4 mb-2 md:mb-4">
              <div className="w-8 md:w-12 h-[1px] bg-accent-gold/40" />
              <p className="text-[8px] md:text-[9px] tracking-[0.5em] uppercase font-sans font-medium text-accent-gold">
                Arutala Studio
              </p>
              <div className="w-8 md:w-12 h-[1px] bg-accent-gold/40" />
            </div>
            
            <h1 className="font-serif w-full text-4xl sm:text-5xl md:text-7xl lg:text-[100px] font-light text-foreground leading-[1.1] md:leading-[0.85] tracking-tight mt-4 md:mt-6">
              Our <span className="italic text-accent-gold/90">Craft</span> & Heritage
            </h1>
            
            <p className="font-serif w-full text-sm md:text-lg text-foreground/70 font-light max-w-xl mx-auto leading-[1.8] mt-6 md:mt-10">
              Arutala is an independent olfactory house creating small-batch botanical perfumes. We compose with a high focus on negative space—letting noble ingredients breathe rather than layering conflicting, heavy chemicals.
            </p>
            
            <div className="mt-12 md:mt-16 w-[1px] h-16 md:h-24 mx-auto relative overflow-hidden bg-foreground/10">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-gold/50 to-transparent animate-pulse" />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 space-y-12 md:space-y-24 mt-12 md:mt-24">
        
        {/* The Manifesto Quote (Replacing the Image) */}
        <div className="w-full max-w-4xl mx-auto py-8 md:py-24 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-[1px] bg-accent-gold/40" />
          <Reveal yOffset={20} className="w-full">
            <p className="font-serif w-full italic text-xl sm:text-2xl md:text-4xl text-foreground/80 leading-relaxed">
              "We do not create perfumes to mask the skin. We compose in negative space, so the soul can be heard."
            </p>
            <p className="font-sans text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-accent-gold/80 mt-6 md:mt-8">
              — The Master Nose
            </p>
          </Reveal>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-[1px] bg-accent-gold/40" />
        </div>

        {/* Two-Column Detail Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <div className="space-y-6">
            <span className="text-[10px] tracking-widest text-gray-400 font-sans uppercase font-medium">01 / The Composition</span>
            <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground">The Nose's Philosophy</h3>
            <p className="text-sm font-sans text-gray-500 font-light leading-relaxed">
              In traditional perfumery, formulas can exceed a hundred complex ingredients, resulting in a noisy olfactive canvas. Our master nose operates with absolute minimalism, rarely exceeding twenty-five lines in a formula.
            </p>
            <p className="text-sm font-sans text-gray-500 font-light leading-relaxed">
              By working with wide space and pristine dilution rates, each individual extract is given the room to breathe. Sandalwood reveals its creamy milk-like side; rose unfolds its green, botanical leafiness; amber shines with metallic, salty, golden heat.
            </p>
          </div>

          <div className="space-y-6">
            <span className="text-[10px] tracking-widest text-gray-400 font-sans uppercase font-medium">02 / The Dawn Harvest</span>
            <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground">Gathered at 5 AM</h3>
            <p className="text-sm font-sans text-gray-500 font-light leading-relaxed">
              Heat and light are the enemies of fragile flower oils. To capture the dewy, crystalline freshness of Turkish Damascus Rose and Jasmin Sambac, our harvest occurs at precisely 5:00 AM, before the morning sun has warmed the petals.
            </p>
            <p className="text-sm font-sans text-gray-500 font-light leading-relaxed">
              Gathered entirely by hand in wicker baskets, the blossoms are rushed to our local copper stills within the hour. This fast-track extraction locks in the ephemeral volatile green fractions—offering a true, hyper-realistic flower scent that replicates the raw botanical living garden.
            </p>
          </div>
        </div>

        {/* Interactive Scent Journey Timeline */}
        <div className="border-t border-cream pt-24 space-y-16" id="scent-journey-section">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] tracking-[0.4em] uppercase font-sans font-medium text-gray-400 block">
              Chronology of Scent
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-foreground tracking-tight animate-fade-in">
              The <span className="italic font-normal">Scent Journey</span>
            </h2>
            <p className="text-xs text-gray-500 font-sans font-light leading-relaxed">
              Witness the evolution of our olfactory architecture. From a single copper still in our Jakarta laboratory to Indonesia's premier botanical house, explore our signature epochs.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto px-4 md:px-0 mt-16" id="scent-journey-timeline">
            
            {/* The vertical timeline spine */}
            <div className="absolute left-6 md:left-1/2 top-4 bottom-8 w-[1px] bg-cream -translate-x-1/2 z-0">
              {/* Active indicator bar tracking selected milestone */}
              <motion.div 
                className="w-full bg-foreground origin-top"
                initial={{ height: 0 }}
                animate={{ 
                  height: `${(activeMilestone / (journeyData.length - 1)) * 100}%` 
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ height: '0%' }}
              />
            </div>

            <div className="space-y-12 relative z-10">
              {journeyData.map((milestone, idx) => {
                const isActive = activeMilestone === idx;
                const isEven = idx % 2 === 0;
                
                const prod = localProducts.find(p => p.name.toLowerCase() === milestone.title.toLowerCase());
                const displaySubtitle = prod?.subtitle || 'Loading...';
                const displayDesc = prod?.description || 'Loading product story...';
                const displayNotes = prod?.notes ? [prod.notes.top[0], prod.notes.heart[0], prod.notes.base[0]] : ['...', '...', '...'];
                const displayImg = prod?.images?.scent || '';

                return (
                  <div 
                    key={milestone.year}
                    className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-4"
                  >
                    
                    {/* Timeline Node Ring */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-6 z-20">
                      <button
                        onClick={() => setActiveMilestone(idx)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border cursor-pointer ${
                          isActive 
                            ? 'bg-foreground border-foreground text-background scale-110 shadow-md ring-4 ring-muted' 
                            : 'bg-background border-cream hover:border-foreground/50 text-foreground/40 hover:text-foreground'
                        }`}
                        aria-label={`Milestone ${milestone.year}`}
                      >
                        {getYearIcon(milestone.year)}
                      </button>
                    </div>

                    {/* Left Column (Desktop) */}
                    <div className={`pl-16 md:pl-0 ${isEven ? 'md:text-right md:order-1' : 'md:order-2'}`}>
                      {isEven ? (
                        /* Content Card on the Left */
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => setActiveMilestone(idx)}
                          className={`group text-left p-6 sm:p-8 border bg-background hover:bg-muted/30 transition-all duration-300 cursor-pointer ${
                            isActive ? 'border-foreground/40 shadow-sm ring-1 ring-foreground/10' : 'border-cream'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <span className="font-serif text-3xl font-light text-foreground">{milestone.year}</span>
                            <span className="text-[9px] tracking-widest font-mono text-foreground/40 font-bold uppercase">{milestone.category}</span>
                          </div>
                          
                          <h3 className="font-serif text-xl font-light text-foreground mb-1 group-hover:text-foreground transition-colors">
                            {milestone.title}
                          </h3>
                          <p className="text-[10px] tracking-wider uppercase font-sans text-gray-400 mb-4">{displaySubtitle}</p>
                          
                          <p className="text-xs sm:text-sm text-gray-500 font-sans font-light leading-relaxed mb-6">
                            {displayDesc}
                          </p>

                          {/* Interactive Notes Button */}
                          <div className="flex items-center justify-between border-t border-cream pt-4">
                            <span className="text-[9px] tracking-wider uppercase font-sans text-gray-400">
                              Concentration: {milestone.year === '2018' ? 'Trial Run' : milestone.year === '2020' ? 'Eau de Parfum' : 'Extrait de Parfum'}
                            </span>
                            <button 
                              className="flex items-center gap-1.5 text-[10px] tracking-widest font-sans font-semibold uppercase text-foreground hover:text-accent-gold transition-colors"
                            >
                              <span>{isActive ? 'Immersed' : 'Explore Notes'}</span>
                              <ArrowRight size={10} className={`transition-transform duration-300 ${isActive ? 'translate-x-1' : ''}`} />
                            </button>
                          </div>

                          {/* Olfactory Note Panel */}
                          <motion.div
                            initial={false}
                            animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6 mt-4 border-t border-cream/80 space-y-4">
                              <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-2.5 bg-muted border border-cream">
                                  <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono font-bold block mb-1">Top</span>
                                  <span className="text-[10px] font-sans text-foreground font-medium block truncate">{displayNotes[0]}</span>
                                </div>
                                <div className="p-2.5 bg-muted border border-cream">
                                  <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono font-bold block mb-1">Heart</span>
                                  <span className="text-[10px] font-sans text-foreground font-medium block truncate">{displayNotes[1]}</span>
                                </div>
                                <div className="p-2.5 bg-muted border border-cream">
                                  <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono font-bold block mb-1">Base</span>
                                  <span className="text-[10px] font-sans text-foreground font-medium block truncate">{displayNotes[2]}</span>
                                </div>
                              </div>

                              <div className="w-full h-36 overflow-hidden border border-cream relative">
                                {displayImg && (
                                  <img
                                    src={displayImg}
                                    alt={milestone.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-2 py-1 border border-cream">
                                  <Eye size={9} className="text-foreground/60" />
                                  <span className="text-[8px] tracking-wider uppercase font-sans font-medium text-foreground">{milestone.scentHighlight}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>

                        </motion.div>
                      ) : (
                        /* Decorative Year Panel on the Left (for Odd indices) */
                        <div className="hidden md:flex flex-col items-end justify-center h-full pr-12 space-y-2 text-right">
                          <span className="text-9xl font-serif font-light text-foreground/5 tracking-tighter select-none leading-none">
                            {milestone.year}
                          </span>
                          <p className="text-xs font-serif italic text-foreground/40 max-w-[200px]">
                            "{milestone.scentHighlight}"
                          </p>
                          <div className="flex gap-2 justify-end">
                            {displayNotes.map(note => (
                              <span key={note} className="text-[8px] tracking-widest uppercase font-sans font-medium px-2 py-0.5 border border-cream/80 text-foreground/50 rounded-full">
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column (Desktop) */}
                    <div className={`pl-16 md:pl-0 ${isEven ? 'md:order-2' : 'md:text-left md:order-1'}`}>
                      {!isEven ? (
                        /* Content Card on the Right */
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          onClick={() => setActiveMilestone(idx)}
                          className={`group text-left p-6 sm:p-8 border bg-background hover:bg-muted/30 transition-all duration-300 cursor-pointer ${
                            isActive ? 'border-foreground/40 shadow-sm ring-1 ring-foreground/10' : 'border-cream'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <span className="font-serif text-3xl font-light text-foreground">{milestone.year}</span>
                            <span className="text-[9px] tracking-widest font-mono text-foreground/40 font-bold uppercase">{milestone.category}</span>
                          </div>
                          
                          <h3 className="font-serif text-xl font-light text-foreground mb-1 group-hover:text-foreground transition-colors">
                            {milestone.title}
                          </h3>
                          <p className="text-[10px] tracking-wider uppercase font-sans text-gray-400 mb-4">{displaySubtitle}</p>
                          
                          <p className="text-xs sm:text-sm text-gray-500 font-sans font-light leading-relaxed mb-6">
                            {displayDesc}
                          </p>

                          {/* Interactive Notes Button */}
                          <div className="flex items-center justify-between border-t border-cream pt-4">
                            <span className="text-[9px] tracking-wider uppercase font-sans text-gray-400">
                              Concentration: {milestone.year === '2018' ? 'Trial Run' : milestone.year === '2020' ? 'Eau de Parfum' : 'Extrait de Parfum'}
                            </span>
                            <button 
                              className="flex items-center gap-1.5 text-[10px] tracking-widest font-sans font-semibold uppercase text-foreground hover:text-accent-gold transition-colors"
                            >
                              <span>{isActive ? 'Immersed' : 'Explore Notes'}</span>
                              <ArrowRight size={10} className={`transition-transform duration-300 ${isActive ? 'translate-x-1' : ''}`} />
                            </button>
                          </div>

                          {/* Olfactory Note Panel */}
                          <motion.div
                            initial={false}
                            animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6 mt-4 border-t border-cream/80 space-y-4">
                              <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="p-2.5 bg-muted border border-cream">
                                  <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono font-bold block mb-1">Top</span>
                                  <span className="text-[10px] font-sans text-foreground font-medium block truncate">{displayNotes[0]}</span>
                                </div>
                                <div className="p-2.5 bg-muted border border-cream">
                                  <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono font-bold block mb-1">Heart</span>
                                  <span className="text-[10px] font-sans text-foreground font-medium block truncate">{displayNotes[1]}</span>
                                </div>
                                <div className="p-2.5 bg-muted border border-cream">
                                  <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono font-bold block mb-1">Base</span>
                                  <span className="text-[10px] font-sans text-foreground font-medium block truncate">{displayNotes[2]}</span>
                                </div>
                              </div>

                              <div className="w-full h-36 overflow-hidden border border-cream relative">
                                {displayImg && (
                                  <img
                                    src={displayImg}
                                    alt={milestone.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                                  />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-2 py-1 border border-cream">
                                  <Eye size={9} className="text-foreground/60" />
                                  <span className="text-[8px] tracking-wider uppercase font-sans font-medium text-foreground">{milestone.scentHighlight}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>

                        </motion.div>
                      ) : (
                        /* Decorative Year Panel on the Right (for Even indices) */
                        <div className="hidden md:flex flex-col items-start justify-center h-full pl-12 space-y-2 text-left">
                          <span className="text-9xl font-serif font-light text-foreground/5 tracking-tighter select-none leading-none">
                            {milestone.year}
                          </span>
                          <p className="text-xs font-serif italic text-foreground/40 max-w-[200px]">
                            "{milestone.scentHighlight}"
                          </p>
                          <div className="flex gap-2">
                            {displayNotes.map(note => (
                              <span key={note} className="text-[8px] tracking-widest uppercase font-sans font-medium px-2 py-0.5 border border-cream/80 text-foreground/50 rounded-full">
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Full-width Quote Section */}
        <div className="bg-cream/40 border border-cream p-12 md:p-20 text-center space-y-6 max-w-4xl mx-auto">
          <span className="text-[9px] tracking-[0.25em] uppercase font-sans text-gray-400 block">Our Creed</span>
          <p className="font-serif italic text-2xl sm:text-3xl text-foreground font-light leading-relaxed max-w-3xl mx-auto">
            "We do not make products to decorate shelves. We compose invisible signatures designed to unlock deep chambers of memory, lingering on skin like soft echoes of a secret dream."
          </p>
          <div className="w-12 h-[1px] bg-cream mx-auto" />
          <p className="text-[10px] tracking-wider uppercase font-sans text-gray-500 font-medium">
            Arutala Nose & Founder
          </p>
        </div>

        {/* FAQ Section */}
        <div className="border-t border-cream pt-24 space-y-12" id="faq-section">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
            
            {/* Left Column: Context / Help Box */}
            <div className="md:w-1/3 md:sticky md:top-36 space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-gray-400 block">
                  Support & Scent Care
                </span>
                <h2 className="font-serif text-3xl font-light text-foreground tracking-tight">
                  Atelier Concierge
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed font-light font-sans">
                  Explore answers regarding boutique logistics, our trial service program, and storage recommendations to extend your fragrance's longevity.
                </p>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { id: 'all', label: 'All Questions' },
                  { id: 'shipping', label: 'Shipping' },
                  { id: 'returns', label: 'Returns' },
                  { id: 'storage', label: 'Storage' },
                  { id: 'formulation', label: 'Formulation' }
                ].map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id as any);
                      setOpenIndex(null); // Close active when filtering
                    }}
                    className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-sans font-semibold border transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-foreground border-foreground text-cream'
                        : 'border-foreground/10 text-foreground/60 hover:border-foreground/40'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Help box card */}
              <div className="border border-cream p-5 space-y-4 bg-muted/50">
                <div className="flex items-center gap-2 text-foreground/60">
                  <HelpCircle size={16} />
                  <span className="text-[10px] tracking-widest uppercase font-sans font-medium">Need Assistance?</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-light font-sans">
                  Our private client services are available to guide your scent profile selection or resolve custom order requests.
                </p>
                <div className="space-y-2 text-[11px] font-sans">
                  <a href="mailto:concierge@arutala.com" className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors">
                    <Mail size={12} />
                    <span>concierge@arutala.com</span>
                  </a>
                  <div className="flex items-center gap-2 text-foreground/40">
                    <Clock size={12} />
                    <span>Mon — Fri, 9:00 — 17:00 WIB</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Collapsible Accordions */}
            <div className="md:w-2/3 space-y-4">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div 
                    key={index} 
                    className={`border border-cream bg-background transition-all duration-300 ${
                      isOpen ? 'border-foreground/30 shadow-sm' : 'hover:border-foreground/20'
                    }`}
                  >
                    {/* Header trigger */}
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 transition-colors"
                    >
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase tracking-widest text-foreground/40 font-mono font-bold">
                          {faq.category}
                        </span>
                        <h4 className="font-serif text-base sm:text-lg text-foreground font-light leading-snug">
                          {faq.question}
                        </h4>
                      </div>
                      <div className={`p-2 rounded-none border border-foreground/5 bg-muted transition-transform duration-300 ${isOpen ? 'rotate-180 bg-foreground/5' : ''}`}>
                        {isOpen ? <Minus size={12} className="text-foreground" /> : <Plus size={12} className="text-foreground/50" />}
                      </div>
                    </button>

                    {/* Collapsible details panel */}
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-cream/50">
                        <p className="text-xs sm:text-sm text-gray-500 font-sans font-light leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="text-center py-12 border border-cream space-y-2">
                  <p className="font-serif italic text-foreground/60">No queries found in this category.</p>
                  <button 
                    onClick={() => setSelectedCategory('all')} 
                    className="text-xs font-sans uppercase tracking-widest font-medium text-foreground underline"
                  >
                    View All Questions
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
