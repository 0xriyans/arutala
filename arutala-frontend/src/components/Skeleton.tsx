import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular' 
}) => {
  const baseClass = "animate-pulse bg-foreground/10";
  
  const variantClasses = {
    rectangular: "rounded-none",
    circular: "rounded-full",
    text: "rounded-sm",
  };

  return (
    <div className={`${baseClass} ${variantClasses[variant]} ${className}`} />
  );
};
