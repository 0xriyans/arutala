import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Preloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide preloader after 1.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="font-serif text-3xl md:text-5xl tracking-[0.4em] uppercase text-foreground font-medium">
              ARUTALA
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
