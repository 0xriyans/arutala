import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for the translation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for magnetic feedback
  const springConfig = { damping: 15, stiffness: 150, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Distance from center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Magnetic factor: how much the button follows the cursor (e.g. 25% of distance)
    x.set(distanceX * 0.28);
    y.set(distanceY * 0.28);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
      }}
      className={`
        relative px-8 py-4 overflow-hidden border border-foreground/30 text-xs tracking-[0.2em] uppercase font-sans font-medium transition-colors duration-300 ease-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Background sweep element */}
      <div
        className={`
          absolute inset-0 bg-foreground transition-transform duration-[500ms] cubic-bezier(0.16, 1, 0.3, 1) origin-left -z-10
          ${isHovered ? 'scale-x-100' : 'scale-x-0'}
        `}
      />

      {/* Button content with text color inversion on hover */}
      <span
        className={`
          relative z-10 transition-colors duration-300 block
          ${isHovered ? 'text-cream font-medium' : 'text-foreground'}
        `}
      >
        {children}
      </span>
    </motion.button>
  );
};
