import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, ShoppingBag, Info, X } from 'lucide-react';
import { products, Product, formatRupiah } from '../data/products';
import { useCart } from '../context/cart-context';
import { ProgressiveImage } from './ProgressiveImage';
import { createPortal } from 'react-dom';

interface Question {
  id: number;
  text: string;
  subtitle: string;
  options: {
    text: string;
    description: string;
    // Map options to specific product weights
    weights: { [slug: string]: number };
  }[];
}

const quizQuestions: Question[] = [
  {
    id: 1,
    text: "Which atmosphere or environment resonates with you?",
    subtitle: "Select a setting where your mind feels most at peace.",
    options: [
      {
        text: "A serene, historic library",
        description: "Surrounded by sunbeam-lit Mysore sandalwood shelves, ancient parchment, and quiet wisdom.",
        weights: { "aksara": 3, "hening": 3, "rempah": 1 }
      },
      {
        text: "A secluded stone courtyard at dawn",
        description: "Quietly walking through dewy gardens filled with freshly blooming roses and crisp green leaves.",
        weights: { "rintik": 3, "puspa": 2, "amerta": 1 }
      },
      {
        text: "A sun-baked coastal cliff",
        description: "Feeling the warm, salty Mediterranean breeze lift orange blossoms and wild citrus groves.",
        weights: { "segara": 3, "fajar": 3, "swarna": 1 }
      },
      {
        text: "An alpine forest after a summer rainstorm",
        description: "Inhaling the profound coolness of clary sage, mossy roots, and wet, breathing earth.",
        weights: { "rintik": 3, "segara": 2, "hening": 1 }
      }
    ]
  },
  {
    id: 2,
    text: "What tactile texture feels most appealing?",
    subtitle: "Fragrance lives on skin; choose the physical sensation you wish to project.",
    options: [
      {
        text: "Soft cashmere & fresh white linen",
        description: "Enveloping, exceptionally clean, whispering comfort and quiet sophistication.",
        weights: { "hening": 3, "rintik": 2, "amerta": 1 }
      },
      {
        text: "Warm resins, velvet wood & amber gold",
        description: "Luxurious, rich, and deeply warm, radiating a soft glowing heat from skin.",
        weights: { "swarna": 3, "aksara": 2, "rempah": 2 }
      },
      {
        text: "Milky sap, fresh pulp & green leaves",
        description: "Botanical, creamy, and succulent, balancing fresh greenery with ripe sweetness.",
        weights: { "puspa": 3, "rintik": 2 }
      },
      {
        text: "Salty mineral sea spray & cold-pressed peel",
        description: "Vibrant, zesty, and electric, offering an instant splash of solar energy.",
        weights: { "fajar": 3, "segara": 3 }
      }
    ]
  },
  {
    id: 3,
    text: "Select the desired frequency of your scent trail (sillage):",
    subtitle: "How would you like your presence to be announced?",
    options: [
      {
        text: "Intimate and whispering",
        description: "A private skin-scent discovered only by those who come exceptionally close.",
        weights: { "hening": 3, "rintik": 2 }
      },
      {
        text: "Bold, majestic, and magnetic",
        description: "Commanding attention with an unforgettable presence that lingers long after you leave.",
        weights: { "amerta": 3, "puspa": 3, "aksara": 1 }
      },
      {
        text: "Bright, luminous, and celebratory",
        description: "An effervescent spark of sunshine that lifts the spirits of everyone in the room.",
        weights: { "fajar": 3, "swarna": 3 }
      },
      {
        text: "Architectural, serene, and grounded",
        description: "Perfect symmetry, dry aromatic herbs, and elegant, self-assured earthiness.",
        weights: { "segara": 3, "rempah": 3 }
      }
    ]
  },
  {
    id: 4,
    text: "What is the perfect light setting for your scent chapter?",
    subtitle: "Fragrances shift and turn as the sun traverses the sky.",
    options: [
      {
        text: "The first crisp, pale rays of dawn",
        description: "Clean morning air, dew drops, and the slow, peaceful awakening of the world.",
        weights: { "fajar": 3, "rintik": 2 }
      },
      {
        text: "The golden hour of late-afternoon sun",
        description: "Warm, long shadows, dry golden heat, and a beautiful, slow-burning tranquility.",
        weights: { "swarna": 3, "rempah": 2 }
      },
      {
        text: "A velvet midnight painted with starlight",
        description: "Intense shadow, narcotic night blooms in full breath, and mysterious shadows.",
        weights: { "puspa": 3, "amerta": 3 }
      },
      {
        text: "The brilliant overhead sun of midsummer",
        description: "Full exposure, dry forest floors, ocean breezes, and boundless positive energy.",
        weights: { "segara": 3, "fajar": 2 }
      }
    ]
  }
];

export const FragranceQuiz: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: intro, 1-4: questions, 5: results
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<{ [slug: string]: number }>({});
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const [addedToCartNotification, setAddedToCartNotification] = useState(false);

  const startQuiz = () => {
    setCurrentStep(1);
    setAnswers([]);
    setScores({});
    setRecommendedProduct(null);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeQuiz = () => {
    setIsOpen(false);
    setCurrentStep(0);
    document.body.style.overflow = '';
  };

  const selectOption = (optionIndex: number) => {
    const currentQuestion = quizQuestions[currentStep - 1];
    const selectedOption = currentQuestion.options[optionIndex];
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    // Update Scores
    const updatedScores = { ...scores };
    Object.keys(selectedOption.weights).forEach((slug) => {
      updatedScores[slug] = (updatedScores[slug] || 0) + selectedOption.weights[slug];
    });
    setScores(updatedScores);

    if (currentStep < quizQuestions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate Recommendation
      let bestSlug = products[0].slug;
      let highestScore = -1;

      products.forEach((product) => {
        const score = updatedScores[product.slug] || 0;
        if (score > highestScore) {
          highestScore = score;
          bestSlug = product.slug;
        }
      });

      const matchedProduct = products.find((p) => p.slug === bestSlug) || products[0];
      setRecommendedProduct(matchedProduct);

      // Log Scent Quiz completion for Admin Panel
      try {
        const quizLog = {
          id: 'QZ-' + Math.floor(100000 + Math.random() * 900000),
          date: new Date().toISOString(),
          answers: newAnswers.map((optIdx, qIdx) => {
            return {
              question: quizQuestions[qIdx].text,
              answer: quizQuestions[qIdx].options[optIdx].text
            };
          }),
          recommendedName: matchedProduct.name,
          recommendedSlug: matchedProduct.slug
        };
        const stored = localStorage.getItem('maison_quiz_history');
        const history = stored ? JSON.parse(stored) : [];
        history.unshift(quizLog);
        localStorage.setItem('maison_quiz_history', JSON.stringify(history));
      } catch (err) {
        console.error('Failed to log quiz', err);
      }

      setCurrentStep(5); // Show result page
    }
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      // Remove latest answer and reconstruct score
      const newAnswers = answers.slice(0, -1);
      setAnswers(newAnswers);

      const reconstructedScores: { [slug: string]: number } = {};
      newAnswers.forEach((answerIdx, qIdx) => {
        const question = quizQuestions[qIdx];
        const option = question.options[answerIdx];
        Object.keys(option.weights).forEach((slug) => {
          reconstructedScores[slug] = (reconstructedScores[slug] || 0) + option.weights[slug];
        });
      });

      setScores(reconstructedScores);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddToCart = () => {
    if (recommendedProduct) {
      addToCart(recommendedProduct);
      setAddedToCartNotification(true);
      setTimeout(() => setAddedToCartNotification(false), 2500);
    }
  };

  const handleViewDetails = () => {
    if (recommendedProduct) {
      closeQuiz();
      window.location.hash = `#/product/${recommendedProduct.slug}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Elegant Inline CTA Card integrated into the HomeRoute */}
      <section className="bg-muted border-t border-b border-cream py-24 md:py-28" id="scent-finder-consultation">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-accent-gold/5 border border-accent-gold/20 flex items-center justify-center text-accent-gold animate-pulse">
              <Sparkles size={16} />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] tracking-[0.4em] uppercase font-sans font-medium text-gray-400">
              Personalized Olfactory Consultation
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-foreground tracking-tight leading-tight">
              Find Your Absolute Signature Scent
            </h2>
            <div className="w-8 h-[1px] bg-foreground/20 mx-auto my-4" />
          </div>

          <p className="text-xs sm:text-sm font-sans text-gray-500 font-light leading-relaxed max-w-xl mx-auto">
            Allow us to guide you through a sensory dialogue. Answer four simple, atmospheric questions to unveil the fragrance collection that perfectly captures your aura.
          </p>

          <div className="pt-4 flex justify-center">
            <button
              onClick={startQuiz}
              id="begin-consultation-btn"
              className="group relative flex items-center space-x-3 bg-foreground text-background px-8 py-4 text-xs font-sans uppercase tracking-[0.2em] hover:bg-foreground/90 hover:shadow-lg transition-all duration-300"
            >
              <span>Begin Consultation</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Bespoke Full-Screen Step-by-Step UI overlay */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[9999] bg-cream overflow-y-auto flex flex-col justify-between"
              id="full-screen-quiz-modal"
            >
              {/* Top Navigation Bar */}
              <div className="w-full max-w-7xl mx-auto px-6 py-6 md:py-8 flex items-center justify-between border-b border-foreground/5" id="quiz-top-bar">
                <div className="flex items-center space-x-3">
                  <span className="font-serif italic text-base md:text-lg tracking-wider text-foreground">
                    ARUTALA
                  </span>
                  <span className="text-xs text-foreground/20">|</span>
                  <span className="text-[9px] uppercase tracking-widest font-sans text-foreground/40 font-medium">
                    Scent Profile Finder
                  </span>
                </div>

                {/* Steps indicator */}
                {currentStep >= 1 && currentStep <= 4 && (
                  <div className="text-[10px] tracking-widest uppercase font-sans text-foreground/40 hidden sm:block">
                    Question {currentStep} <span className="text-foreground/20">/</span> {quizQuestions.length}
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={closeQuiz}
                  aria-label="Close consultation"
                  className="w-10 h-10 rounded-full border border-foreground/5 hover:bg-foreground/5 flex items-center justify-center text-foreground/60 hover:text-foreground transition-all duration-300"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Main Interactive Stage */}
              <div className="flex-grow flex items-center justify-center px-6 py-12" id="quiz-main-stage">
                <div className="w-full max-w-3xl mx-auto">
                  <AnimatePresence>
                    {currentStep >= 1 && currentStep <= 4 && (
                      <motion.div
                        key={`step-${currentStep}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-10"
                        id={`quiz-question-step-${currentStep}`}
                      >
                        {/* Step Progress Bar (Mobile and Desktop) */}
                        <div className="w-full h-[2px] bg-foreground/5 relative overflow-hidden rounded-full mb-2">
                          <motion.div 
                            className="absolute h-full left-0 bg-accent-gold"
                            initial={{ width: `${((currentStep - 1) / quizQuestions.length) * 100}%` }}
                            animate={{ width: `${(currentStep / quizQuestions.length) * 100}%` }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>

                        {/* Question Text */}
                        <div className="space-y-3 text-center sm:text-left">
                          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-semibold text-accent-gold">
                            Sensory Dialogue {currentStep} of {quizQuestions.length}
                          </span>
                          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-foreground tracking-tight leading-tight">
                            {quizQuestions[currentStep - 1].text}
                          </h3>
                          <p className="text-xs sm:text-sm font-sans text-gray-500 font-light">
                            {quizQuestions[currentStep - 1].subtitle}
                          </p>
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2" id={`options-grid-${currentStep}`}>
                          {quizQuestions[currentStep - 1].options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => selectOption(idx)}
                              className="group text-left p-6 sm:p-8 bg-background border border-foreground/5 hover:border-accent-gold/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 focus:outline-none"
                              id={`option-btn-${currentStep}-${idx}`}
                            >
                              <div className="space-y-2">
                                <span className="text-[10px] tracking-widest font-sans font-medium text-foreground/30 uppercase group-hover:text-accent-gold transition-colors duration-300">
                                  Option {String.fromCharCode(65 + idx)}
                                </span>
                                <h4 className="font-serif text-lg text-foreground font-light tracking-tight group-hover:text-accent-gold transition-colors duration-300">
                                  {option.text}
                                </h4>
                                <p className="text-xs font-sans text-gray-500 font-light leading-relaxed">
                                  {option.description}
                                </p>
                              </div>
                              
                              <div className="flex justify-end pt-2">
                                <span className="text-[10px] tracking-widest uppercase font-sans font-medium text-foreground/40 group-hover:text-foreground group-hover:translate-x-1.5 transition-all duration-300 flex items-center space-x-1.5">
                                  <span>Select</span>
                                  <ArrowRight size={10} />
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Results Step */}
                    {currentStep === 5 && recommendedProduct && (
                      <motion.div
                        key="results-step"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
                        id="quiz-results-view"
                      >
                        {/* Product Image Panel (Left/Top) */}
                        <div className="lg:col-span-5 relative group" id="quiz-result-image-col">
                          <div className="aspect-[4/5] bg-muted overflow-hidden border border-foreground/5 shadow-md relative">
                            <ProgressiveImage
                              src={recommendedProduct.images.primary}
                              alt={recommendedProduct.name}
                              referrerPolicy="no-referrer"
                              className="transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                            />
                            
                            {/* Match Seal */}
                            <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm border border-accent-gold/20 px-3 py-1.5 shadow-sm text-center">
                              <span className="block text-[8px] tracking-[0.2em] uppercase font-sans text-gray-400 font-semibold">Perfect Match</span>
                              <span className="block text-[10px] tracking-[0.05em] uppercase font-sans text-accent-gold font-bold">100% Aura Align</span>
                            </div>
                          </div>
                        </div>

                        {/* Product Description details (Right/Bottom) */}
                        <div className="lg:col-span-7 space-y-6" id="quiz-result-details-col">
                          <div className="space-y-2">
                            <span className="inline-block text-[9px] tracking-[0.3em] uppercase font-sans font-semibold text-accent-gold border border-accent-gold/25 px-3 py-1 bg-accent-gold/5">
                              {recommendedProduct.family} Family
                            </span>
                            
                            <p className="text-[10px] tracking-widest uppercase font-sans font-light text-gray-400 pt-1">
                              Your Signature Profile Recipient
                            </p>
                            <h3 className="font-serif text-3xl sm:text-4xl font-light text-foreground tracking-tight leading-tight">
                              {recommendedProduct.name}
                            </h3>
                            <p className="text-xs sm:text-sm font-sans text-foreground/60 italic">
                              {recommendedProduct.subtitle}
                            </p>
                          </div>

                          {/* Story / Emotional Match reason */}
                          <div className="border-l-2 border-accent-gold/30 pl-4 space-y-1">
                            <span className="text-[8px] uppercase tracking-widest text-gray-400 font-sans font-bold">The Resonance</span>
                            <p className="font-serif italic text-xs sm:text-sm text-foreground/80 leading-relaxed">
                              "{recommendedProduct.story.split('.')[0]}. This scent mirrors your deep preferences for {recommendedProduct.family.toLowerCase()} essences and aesthetic surroundings."
                            </p>
                          </div>

                          <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
                              <span className="text-xs tracking-widest uppercase font-sans text-foreground/60">Sillage Intensity</span>
                              <span className="text-sm font-serif italic text-foreground">{recommendedProduct.concentration}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
                              <span className="text-xs tracking-widest uppercase font-sans text-foreground/60">Volume</span>
                              <span className="text-sm font-serif italic text-foreground">{recommendedProduct.volume}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-sm font-sans font-medium">{formatRupiah(recommendedProduct.price)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                              onClick={handleAddToCart}
                              className={`relative group flex items-center justify-center space-x-2 py-4 px-6 text-xs tracking-widest uppercase font-sans transition-all duration-300 ${
                                addedToCartNotification 
                                ? 'bg-accent-gold text-background'
                                : 'bg-foreground text-background hover:bg-foreground/90 hover:shadow-lg'
                              }`}
                            >
                              <span className="relative z-10 flex items-center space-x-2">
                                {addedToCartNotification ? (
                                  <>
                                    <Sparkles size={14} className="animate-in zoom-in" />
                                    <span>Acquired</span>
                                  </>
                                ) : (
                                  <>
                                    <ShoppingBag size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                                    <span>Acquire Specimen</span>
                                  </>
                                )}
                              </span>
                            </button>
                            
                            <button
                              onClick={handleViewDetails}
                              className="group flex items-center justify-center space-x-2 py-4 px-6 border border-foreground/20 text-foreground text-xs tracking-widest uppercase font-sans hover:border-foreground transition-all duration-300"
                            >
                              <Info size={14} className="group-hover:text-accent-gold transition-colors" />
                              <span>View Details</span>
                            </button>
                          </div>

                          <div className="flex justify-center pt-4">
                            <button 
                              onClick={startQuiz}
                              className="text-[10px] tracking-widest uppercase font-sans text-foreground/40 hover:text-foreground flex items-center space-x-1.5 transition-colors"
                            >
                              <RefreshCw size={10} />
                              <span>Restart Dialogue</span>
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom Actions Bar (Back & Reset buttons) */}
              <div className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-foreground/5 flex items-center justify-between" id="quiz-bottom-bar">
                {currentStep >= 2 && currentStep <= 4 ? (
                  <button
                    onClick={handleGoBack}
                    className="flex items-center space-x-2 text-[10px] tracking-widest uppercase font-sans text-foreground/40 hover:text-foreground transition-all duration-300"
                  >
                    <ArrowLeft size={12} />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                <p className="text-[8px] font-sans text-foreground/30 uppercase tracking-widest">
                  All formulations are hand-crafted, cruelty-free, and vegan.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
