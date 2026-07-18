import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Position of the mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for the lagging outer circle
  const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if touch device
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      );
    };

    checkTouchDevice();

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return; // Do not initialize listeners on touch devices
    }

    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX - 12); // Offset half width of outer ring
      mouseY.set(e.clientY - 12);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Dynamic hover states for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if hovering over interactive components
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.cursor-pointer') ||
        target.classList.contains('group') ||
        target.closest('.group');

      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', moveMouse);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Outer lagging ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovered ? 1.5 : 1,
          borderColor: isHovered ? 'rgba(197, 168, 128, 0.8)' : 'rgba(0, 0, 0, 0.25)',
          backgroundColor: isHovered ? 'rgba(197, 168, 128, 0.05)' : 'rgba(0, 0, 0, 0)',
        }}
        transition={{
          type: 'tween',
          ease: 'backOut',
          duration: 0.3,
        }}
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-foreground/30 pointer-events-none z-50 mix-blend-difference hidden md:block"
        id="custom-cursor-outer"
      />

      {/* Instant center dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          scale: isHovered ? 0.5 : 1,
          backgroundColor: isHovered ? '#C5A880' : 'rgba(0, 0, 0, 0.8)',
        }}
        transition={{
          type: 'tween',
          ease: 'linear',
          duration: 0.1,
        }}
        className="fixed top-0 left-0 w-1 h-1 rounded-full bg-foreground pointer-events-none z-50 translate-x-2.5 translate-y-2.5 mix-blend-difference hidden md:block"
        id="custom-cursor-inner"
      />
    </>
  );
};
