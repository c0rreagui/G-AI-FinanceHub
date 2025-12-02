import React from 'react';
import { cn } from '../../utils/utils';

interface AuroraBackgroundProps {
  className?: string;
  show?: boolean;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ className, show = true }) => {
  if (!show) return null;

  return (
    <div className={cn("fixed inset-0 z-[-1] overflow-hidden pointer-events-none", className)}>
      <div className="absolute inset-0 bg-background transition-colors duration-500" />
      
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-30 dark:opacity-20 animate-aurora-spin">
        <div className="absolute top-0 left-0 w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,var(--primary)_60deg,transparent_120deg,var(--accent)_180deg,transparent_240deg,var(--secondary)_300deg,transparent_360deg)] blur-[100px]" />
      </div>
      
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[100px]" />
    </div>
  );
};
