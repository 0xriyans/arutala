import React, { useEffect, useState } from 'react';
import { products, formatRupiah } from '../data/products';
import { useCart } from '../context/cart-context';
import { Reveal, StaggerContainer, StaggerItem } from '../components/Reveal';
import { ParallaxImage } from '../components/ParallaxImage';
import { MailOpen, Compass, Gift, ChevronDown } from 'lucide-react';
import { ChatWidget } from '../components/ChatWidget';

export const DiscoverySetRoute: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedVials, setSelectedVials] = useState<string[]>(['', '', '', '', '']);
  const discoverySet = products.find(p => p.slug === 'discovery-set');

  useEffect(() => {
    document.title = "Discovery — ARUTALA";
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  if (!discoverySet) return null;

  const handleUpdateVial = (index: number, value: string) => {
    const newVials = [...selectedVials];
    newVials[index] = value;
    setSelectedVials(newVials);
  };

  const handleAddToBag = () => {
    addToCart(discoverySet, 1, selectedVials);
  };

  const allSelected = selectedVials.every(v => v !== '');

  return (
    <div className="bg-background min-h-screen pt-24 pb-24" id="discovery-set-page">
      
      {/* Pure Typography Minimalist Hero */}
      <div className="w-full flex items-center justify-center pt-32 pb-16 md:pt-40 md:pb-24 border-b border-foreground/5 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-gold/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center space-y-8 px-6 max-w-3xl relative z-10">
          <StaggerContainer delay={0.1} className="flex flex-col items-center">
            <StaggerItem yOffset={20}>
              <div className="inline-flex items-center gap-4 mb-4">
                <div className="w-12 h-[1px] bg-accent-gold/40" />
                <p className="text-[9px] tracking-[0.5em] uppercase font-sans font-medium text-accent-gold">
                  Your Olfactive Journey
                </p>
                <div className="w-12 h-[1px] bg-accent-gold/40" />
              </div>
            </StaggerItem>
            <StaggerItem yOffset={30}>
              <h1 className="font-serif text-6xl md:text-8xl lg:text-[110px] font-light text-foreground leading-[0.85] tracking-tight">
                Dis<span className="italic text-accent-gold/90">covery.</span>
              </h1>
            </StaggerItem>
            <StaggerItem yOffset={20}>
              <p className="font-sans text-sm md:text-base text-gray-500 font-light max-w-lg mx-auto leading-relaxed mt-10">
                An intimate introduction to the ARUTALA collection. Curate five chapters of memories, beautifully presented in 2ml glass flacons, waiting to unfold on your skin.
              </p>
            </StaggerItem>
            <StaggerItem yOffset={20}>
              <div className="mt-16 w-[1px] h-24 mx-auto relative overflow-hidden bg-foreground/10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-gold/50 to-transparent animate-pulse" />
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>

      {/* Article Content - Editorial Style */}
      <div className="w-full bg-cream/30 py-24 md:py-32 border-t border-foreground/5">
        <div className="max-w-4xl mx-auto px-6 space-y-24 md:space-y-32">
          
          {/* The Genesis */}
          <Reveal yOffset={30}>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <div className="md:w-1/3">
                <p className="text-[9px] tracking-[0.3em] uppercase font-sans font-medium text-foreground/40 border-b border-foreground/10 pb-4">
                  The Genesis
                </p>
                <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mt-6 leading-tight">
                  Why We Created <br className="hidden md:block" />
                  <span className="italic">Discovery</span>
                </h3>
              </div>
              <div className="md:w-2/3 space-y-6 pt-2">
                <p className="font-serif italic text-lg md:text-xl text-foreground/80 leading-relaxed border-l-2 border-accent-gold/30 pl-6">
                  "Choosing a fragrance should never be a blind transaction. It is the beginning of a very personal relationship."
                </p>
                <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8]">
                  Shopping for perfume online often forces you to guess based on mere descriptions and reviews. We wanted to completely disrupt this impersonal, high-risk experience. The <strong className="font-medium text-foreground">ARUTALA Discovery Set</strong> was born out of a desire to bring the intimate boutique atelier consultation directly into your living room.
                </p>
                <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8]">
                  We want you to smell the actual terroir of our Indian Sandalwood, feel the resinous warmth of our Amber, and witness how each delicate top note dances with your unique skin chemistry over several hours—long before you ever commit to a full-size flacon.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Chapter 1: Invitation */}
          <Reveal yOffset={30}>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <div className="md:w-1/3">
                <p className="text-[9px] tracking-[0.3em] uppercase font-sans font-medium text-foreground/40 border-b border-foreground/10 pb-4">
                  Chapitre I
                </p>
                <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mt-6 leading-tight">
                  A Personal <br className="hidden md:block" />
                  <span className="italic">Invitation</span>
                </h3>
              </div>
              <div className="md:w-2/3 space-y-6 pt-2">
                <p className="font-serif italic text-lg md:text-xl text-foreground/80 leading-relaxed border-l-2 border-accent-gold/30 pl-6">
                  "We believe finding your signature scent is an intimate journey that shouldn't be rushed."
                </p>
                <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8]">
                  This Discovery Set is our personal invitation for you to experience the poetry of our boutique atelier in the comfort of your own home, allowing each fragrance to interact beautifully with your unique skin chemistry.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Chapter 2: The Concept */}
          <Reveal yOffset={30}>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <div className="md:w-1/3 md:order-2">
                <p className="text-[9px] tracking-[0.3em] uppercase font-sans font-medium text-foreground/40 border-b border-foreground/10 pb-4 text-left md:text-right">
                  Chapitre II
                </p>
                <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mt-6 leading-tight text-left md:text-right">
                  The <br className="hidden md:block" />
                  <span className="italic">Concept</span>
                </h3>
              </div>
              <div className="md:w-2/3 space-y-6 pt-2 md:order-1 text-left md:text-right">
                <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8]">
                  You are in complete control of your exploration. Curate your own elegant box containing five 2ml glass vials of our signature extrait de parfums. 
                </p>
                <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8]">
                  Take your time to live with each scent, layer them, and let the different chapters of memories unfold naturally throughout your day.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Chapter 3: The Reward */}
          <Reveal yOffset={30}>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <div className="md:w-1/3">
                <p className="text-[9px] tracking-[0.3em] uppercase font-sans font-medium text-foreground/40 border-b border-foreground/10 pb-4">
                  Chapitre III
                </p>
                <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mt-6 leading-tight">
                  The <br className="hidden md:block" />
                  <span className="italic">Reward</span>
                </h3>
              </div>
              <div className="md:w-2/3 space-y-6 pt-2">
                <div className="p-8 bg-background border border-foreground/10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl pointer-events-none" />
                  <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8] relative z-10">
                    As a token of our deepest appreciation for trusting ARUTALA, every purchase of this set includes a complimentary digital voucher worth <strong className="font-serif italic font-normal text-xl">Rp 350.000</strong>. 
                  </p>
                  <p className="font-serif text-base md:text-lg text-foreground/75 font-light leading-[1.8] mt-4 relative z-10">
                    Whenever you are ready, use it towards your first full-size (100ml) bottle. Let your journey guide your next step.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>

      {/* Curation Section (Cart logic) */}
      <div className="max-w-5xl mx-auto px-6 py-16 border-t border-foreground/10">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          
          <div className="w-full md:w-1/2 space-y-8 order-2 md:order-1">
            <Reveal yOffset={20}>
              <h2 className="font-serif text-4xl font-light text-foreground">
                Curate Your Set
              </h2>
              <p className="font-sans text-sm text-foreground/60 mt-4">
                Select 5 fragrances to include in your personalized Discovery. 
                You may select the same fragrance multiple times.
              </p>
              <div className="mt-6 text-2xl font-serif text-foreground">
                {formatRupiah(discoverySet.price)}
              </div>
            </Reveal>

            <div className="space-y-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <div 
                  key={index} 
                  className={`flex flex-col space-y-2 p-5 transition-all duration-500 border relative overflow-hidden group ${
                    selectedVials[index] 
                      ? 'bg-cream/10 border-accent-gold/50' 
                      : 'bg-transparent border-foreground/10 hover:border-foreground/30'
                  }`}
                >
                  {/* Decorative background glow when selected */}
                  {selectedVials[index] && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl pointer-events-none" />
                  )}

                  <div className="flex justify-between items-center relative z-10">
                    <label className="text-[10px] tracking-[0.2em] uppercase font-sans font-medium text-foreground/50 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-gold inline-block" />
                      Vial 0{index + 1}
                    </label>
                    <span className="text-[9px] font-mono text-foreground/30 uppercase">2ml / 0.06 fl.oz</span>
                  </div>

                  <div className="relative group/select z-10 mt-2">
                    <select 
                      value={selectedVials[index]}
                      onChange={(e) => handleUpdateVial(index, e.target.value)}
                      className="w-full py-3 bg-transparent border-b border-foreground/20 text-sm md:text-base font-serif text-foreground outline-none focus:border-accent-gold transition-all duration-300 appearance-none cursor-pointer group-hover/select:border-foreground/40"
                    >
                      <option value="" disabled className="bg-background text-foreground">Select a fragrance chapter...</option>
                      {products.filter(p => p.slug !== 'discovery-set').map(p => (
                        <option key={p.slug} value={p.name} className="bg-background text-foreground">{p.name} — {p.family}</option>
                      ))}
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40 transition-transform duration-300 group-hover/select:translate-y-[-20%]">
                      <ChevronDown size={14} strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  {/* Elegant description reveal */}
                  <div className={`overflow-hidden transition-all duration-500 ${selectedVials[index] ? 'max-h-20 opacity-100 pt-2' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[11px] font-sans text-foreground/60 italic leading-relaxed border-l border-accent-gold/30 pl-3">
                      {products.find(p => p.name === selectedVials[index])?.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddToBag}
              disabled={!allSelected}
              className={`w-full py-4 text-xs tracking-[0.2em] uppercase font-sans font-medium transition-all duration-300 ${
                allSelected 
                  ? 'bg-foreground text-background hover:opacity-90' 
                  : 'bg-foreground/10 text-foreground/30 cursor-not-allowed'
              }`}
            >
              {allSelected ? 'Add to Bag' : 'Select 5 Vials'}
            </button>
          </div>

          <div className="w-full md:w-1/2 md:sticky md:top-24 order-1 md:order-2">
            <div className="w-full aspect-[3/4] border border-foreground/10 bg-cream/5 p-4 shadow-sm">
              <div className="relative w-full h-full overflow-hidden border border-foreground/5 bg-background">
                <ParallaxImage 
                  src={discoverySet.images.primary}
                  alt="Discovery Set Vials"
                  intensity={20}
                  className="w-full h-full"
                  zoomClassName="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
