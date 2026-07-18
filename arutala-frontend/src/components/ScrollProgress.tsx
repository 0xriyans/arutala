import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  
  // Use a smooth spring to make the tracking feel highly tactile and fluid
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-transparent z-[100] pointer-events-none" id="scroll-progress-container">
      <motion.div
        style={{ scaleX }}
        className="w-full h-full bg-accent-gold origin-left"
        id="scroll-progress-bar"
      />
    </div>
  );
};
