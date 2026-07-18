import React from 'react';
import { motion } from 'motion/react';
import { Reveal, StaggerContainer, StaggerItem } from './Reveal';
import { Sparkles, Compass, Eye, MapPin } from 'lucide-react';
import { ParallaxImage } from './ParallaxImage';

interface StoryChapter {
  id: string;
  family: 'Woody' | 'Floral' | 'Citrus';
  frenchTitle: string;
  englishTitle: string;
  subtitle: string;
  poem: string;
  description: string;
  ambiance: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }[];
  image: string;
  accentColor: string;
}

const chapters: StoryChapter[] = [
  {
    id: 'woody-story',
    family: 'Woody',
    frenchTitle: 'Chapitre I: Les Bois Sacrés',
    englishTitle: 'The Woody Collection',
    subtitle: 'Quiet Temples, Mysore Sandalwood & Fossilized Resins',
    poem: '“A low afternoon sun painting golden bands on library floors. The ancient silence of dry cedar and warm, bare skin.”',
    description: 'Our Woody collection is an architectural exploration of permanence. Composed of sustainable, cold-pressed Mysore Sandalwood, smoked Guaiacwood, and mystical Frankincense, these scents interact deeply with body chemistry to form an intensely intimate, warm aura that drys down to a velvety, quiet luxury.',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=1000&h=1200',
    accentColor: 'text-[#C5A880]',
    ambiance: [
      { icon: <MapPin size={14} />, label: 'Terroir', value: 'Siena & Assam Highlands' },
      { icon: <Compass size={14} />, label: 'Character', value: 'Reverent, Earthy, Permanent' },
      { icon: <Eye size={14} />, label: 'Sillages', value: 'Mysore Sandalwood & Saffron' },
    ]
  },
  {
    id: 'floral-story',
    family: 'Floral',
    frenchTitle: 'Chapitre II: Les Fleurs Silencieuses',
    englishTitle: 'The Floral Collection',
    subtitle: 'Walled Gardens, Damascus Rose & Cashmere Linens',
    poem: '“Restraint in a loud world. A single, dewy bloom in a stone courtyard, wrapped in cashmere musks at the first light of dawn.”',
    description: 'Stripping away the heavy powder of classical bouquets, the Floral compositions celebrate single-note botanical integrity. By hand-harvesting Damascus Rose in Turkish valleys at daybreak and balancing it with wild Indian Tuberose, we construct airy, watercolors that smell of dew on grass, fresh green sap, and luxurious cashmere linens.',
    image: 'https://images.unsplash.com/photo-1590156546746-c58d04297316?auto=format&fit=crop&q=80&w=1000&h=1200',
    accentColor: 'text-[#E0B2B2]',
    ambiance: [
      { icon: <MapPin size={14} />, label: 'Terroir', value: 'Java Garden & Nusantara' },
      { icon: <Compass size={14} />, label: 'Character', value: 'Candid, Dewy, Whispering' },
      { icon: <Eye size={14} />, label: 'Sillages', value: 'Damascus Rose & White Musk' },
    ]
  },
  {
    id: 'citrus-story',
    family: 'Citrus',
    frenchTitle: 'Chapitre III: Les Hespéridées',
    englishTitle: 'The Citrus Collection',
    subtitle: 'Sun-kissed Amalfi Cliffs, Orange Blossoms & Sea Breezes',
    poem: '“Sunshine distilled. Crisp, green petitgrain leaves crushed between fingers, with a salty Mediterranean breeze lifting the spirit.”',
    description: 'Our Citrus collection is a celebration of luminous, fleeting joy. Formulated as rich Eaux de Cologne Intenses, we pair cold-pressed Sicilian lemons and bitter Calabrian bergamot with creamy orange blossoms and mineral sea salt, creating a sparkling, clean, and radiant signature that floats effortlessly.',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=1000&h=1200',
    accentColor: 'text-[#E6C687]',
    ambiance: [
      { icon: <MapPin size={14} />, label: 'Terroir', value: 'Bali Coast & Nusantara' },
      { icon: <Compass size={14} />, label: 'Character', value: 'Luminous, Salty, Joyous' },
      { icon: <Eye size={14} />, label: 'Sillages', value: 'Amalfi Lemon & Orange Blossom' },
    ]
  }
];

export const ScentStory: React.FC = () => {
  return (
    <section className="bg-background py-28 md:py-36 border-t border-cream overflow-hidden" id="scent-stories-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24 md:space-y-36">
        
        {/* Intro Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto" id="scent-story-intro">
          <Reveal duration={0.8} yOffset={20}>
            <p className="text-[10px] tracking-[0.4em] uppercase font-sans font-medium text-gray-400">
              The Olfactory Chronicles
            </p>
          </Reveal>
          
          <Reveal delay={0.1} duration={0.8} yOffset={20}>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight leading-tight">
              Scent Stories
            </h2>
          </Reveal>

          <Reveal delay={0.2} duration={0.8} yOffset={20}>
            <div className="w-12 h-[1px] bg-foreground/15 mx-auto my-6" />
            <p className="text-xs sm:text-sm font-sans text-gray-500 font-light leading-relaxed">
              Every fragrance from Arutala is an emotional portrait. We craft scent chapters inspired by quiet architectures, fleeting natural light, and forgotten memories.
            </p>
          </Reveal>
        </div>

        {/* Alternating Editorial Sections */}
        <div className="space-y-32 md:space-y-44" id="scent-chapters-container">
          {chapters.map((chapter, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div 
                key={chapter.id} 
                id={chapter.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center`}
              >
                {/* Image Column - Alternates Side */}
                <div 
                  className={`lg:col-span-6 overflow-hidden relative group ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                  id={`${chapter.id}-image-col`}
                >
                  <Reveal 
                    duration={1} 
                    yOffset={40}
                    className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] bg-cream relative overflow-hidden"
                  >
                    {/* Artistic Thin Frame */}
                    <div className="absolute inset-4 border border-white/20 z-10 pointer-events-none transition-all duration-700 group-hover:inset-6" />
                    
                    <ParallaxImage 
                      src={chapter.image} 
                      alt={chapter.englishTitle}
                      intensity={40}
                      className="w-full h-full"
                      zoomClassName="w-full h-full object-cover grayscale-[25%] transition-all duration-[1500ms] ease-out group-hover:scale-110 group-hover:grayscale-0"
                    />
                    
                    {/* Overlay Label */}
                    <div className="absolute bottom-8 left-8 z-10 text-white font-serif italic text-lg opacity-85">
                      {chapter.frenchTitle.split(':')[0]}
                    </div>
                  </Reveal>
                </div>

                {/* Content Column */}
                <div 
                  className={`lg:col-span-6 space-y-8 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                  id={`${chapter.id}-content-col`}
                >
                  <StaggerContainer delay={0.2} className="space-y-6">
                    
                    {/* Category Stamp */}
                    <StaggerItem yOffset={15}>
                      <span className="inline-block text-[9px] tracking-[0.3em] uppercase font-sans font-semibold text-accent-gold border border-accent-gold/20 px-3 py-1 bg-accent-gold/5">
                        {chapter.family} Signature
                      </span>
                    </StaggerItem>

                    {/* Titles */}
                    <StaggerItem yOffset={15} className="space-y-2">
                      <p className="text-xs tracking-wider uppercase font-sans font-light text-gray-400">
                        {chapter.frenchTitle}
                      </p>
                      <h3 className="font-serif text-2xl sm:text-3xl font-light text-foreground tracking-tight">
                        {chapter.englishTitle}
                      </h3>
                      <p className="text-xs font-sans text-foreground/60 italic">
                        {chapter.subtitle}
                      </p>
                    </StaggerItem>

                    {/* Poetic quote */}
                    <StaggerItem yOffset={20}>
                      <p className="font-serif italic text-base sm:text-lg text-foreground/80 border-l-2 border-accent-gold/30 pl-4 py-1 leading-relaxed">
                        {chapter.poem}
                      </p>
                    </StaggerItem>

                    {/* Deep Description */}
                    <StaggerItem yOffset={20}>
                      <p className="text-xs sm:text-sm font-sans text-gray-500 font-light leading-relaxed">
                        {chapter.description}
                      </p>
                    </StaggerItem>

                    {/* Atmospheric Terroir details */}
                    <StaggerItem yOffset={25} className="pt-4">
                      <div className="grid grid-cols-3 gap-4 border-t border-cream pt-6" id={`${chapter.id}-ambiance-grid`}>
                        {chapter.ambiance.map((item, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center space-x-1.5 text-gray-400">
                              <span className={chapter.accentColor}>{item.icon}</span>
                              <span className="text-[9px] uppercase tracking-widest font-sans font-medium">{item.label}</span>
                            </div>
                            <p className="text-[10px] sm:text-xs font-serif text-foreground font-light truncate">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </StaggerItem>

                  </StaggerContainer>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
