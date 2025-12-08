import React from 'react';
import { cn } from '../../utils/utils';

interface AuroraBackgroundProps {
  className?: string;
  show?: boolean;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ className, show = true }) => {
  if (!show) return null;

  return (
    <div className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute inset-0 bg-background transition-colors duration-500" />
      
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-50 dark:opacity-40 animate-aurora-spin">
        <div className="absolute top-0 left-0 w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,var(--primary)_60deg,transparent_120deg,var(--accent)_180deg,transparent_240deg,var(--secondary)_300deg,transparent_360deg)] blur-[100px]" />
      </div>
      
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[100px]" />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg_viewBox=%270_0_200_200%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter_id=%27noiseFilter%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.8%27_numOctaves=%273%27_stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')]" />
    </div>
  );
};
