import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { Reveal } from './Reveal';
import { MagneticButton } from './MagneticButton';

export const NewsletterSubscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate luxury API subscription
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
    }, 1500);
  };

  return (
    <section className="bg-background py-28 border-t border-cream relative overflow-hidden" id="newsletter-subscribe-section">
      {/* Decorative fine-line organic grids to mirror the perfume architecture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-foreground" />
        <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-foreground" />
        <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-foreground" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10">
        
        {/* Editorial Headers */}
        <div className="space-y-4">
          <Reveal duration={0.8} yOffset={20}>
            <p className="text-[10px] tracking-[0.4em] uppercase font-sans font-medium text-gray-400">
              The Arutala Register
            </p>
          </Reveal>
          
          <Reveal delay={0.1} duration={0.8} yOffset={20}>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight leading-tight">
              Olfactive Correspondence
            </h2>
          </Reveal>

          <Reveal delay={0.2} duration={0.8} yOffset={20}>
            <p className="text-xs sm:text-sm font-sans text-gray-500 max-w-lg mx-auto font-light leading-relaxed">
              Subscribe to unlock private invitations to our seasonal collections, priority early access to numbered hand-crafted batch releases, and exclusive brand updates.
            </p>
          </Reveal>
        </div>

        {/* Minimalist Interactive Subscription Form Container */}
        <Reveal delay={0.3} duration={0.8} yOffset={25} className="max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="subscribe-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Minimalist Input Field with Dynamic Custom Border/Label styling */}
                <div 
                  className={`relative flex items-center transition-all duration-500 py-3.5 px-1 border-b ${
                    isFocused 
                      ? 'border-foreground' 
                      : 'border-foreground/15 hover:border-foreground/40'
                  }`}
                  id="email-input-container"
                >
                  <Mail 
                    size={15} 
                    className={`mr-4 transition-colors duration-500 flex-shrink-0 ${
                      isFocused ? 'text-foreground' : 'text-gray-300'
                    }`} 
                  />
                  
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    placeholder="Enter your email for early access"
                    value={email}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-sans tracking-wide placeholder-gray-300 focus:outline-none disabled:opacity-50 text-foreground transition-all duration-300"
                    id="subscribe-email-input"
                  />
                  
                  {/* Fine status indicators */}
                  {email && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.5, scale: 1 }}
                      className="text-[9px] uppercase tracking-wider font-sans font-medium text-gray-400 absolute right-4 hidden sm:inline"
                    >
                      valid email
                    </motion.span>
                  )}
                </div>

                {/* Tactile Magnetic Submit Button Row */}
                <div className="flex justify-center pt-2" id="submit-button-row">
                  <MagneticButton
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="px-10 py-4.5 border border-foreground/30 text-[10px] tracking-[0.25em] font-sans font-medium uppercase min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <span>Request Invitation</span>
                        <ArrowRight size={12} className="ml-1" />
                      </span>
                    )}
                  </MagneticButton>
                </div>

                {/* Privacy Assurance */}
                <div className="flex items-center justify-center space-x-1.5 text-[9px] text-gray-400 uppercase tracking-widest font-sans font-light">
                  <ShieldCheck size={11} className="text-gray-300" />
                  <span>Your privacy is absolute. Unsubscribe anytime.</span>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="subscription-success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 18 }}
                className="p-8 md:p-12 bg-cream/40 border border-cream text-center space-y-5 max-w-lg mx-auto"
                id="subscription-success-box"
              >
                <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center mx-auto shadow-sm">
                  <Check size={20} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-light text-foreground">
                    Invitation Sent
                  </h3>
                  <p className="text-xs font-sans text-gray-500 font-light leading-relaxed max-w-sm mx-auto">
                    Bienvenue. Your email has been added to our private register. A luxury welcome and early access details are winging their way to you.
                  </p>
                </div>

                <div className="w-8 h-[1px] bg-foreground/15 mx-auto" />

                <span className="text-[9px] tracking-[0.2em] uppercase font-sans font-medium text-gray-400 block">
                  ARUTALA © 2026
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>

      </div>
    </section>
  );
};
