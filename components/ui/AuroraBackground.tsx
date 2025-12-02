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

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
           }}
      />
    </div>
  );
};
