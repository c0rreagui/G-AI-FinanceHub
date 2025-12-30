import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// This is a wrapper for 3D content like Spline or Three.js
// Usage: <ThreeDWrapper url="https://prod.spline.design/..." />

interface ThreeDWrapperProps {
  url?: string;
  className?: string;
}

export const ThreeDWrapper: React.FC<ThreeDWrapperProps> = ({ url, className }) => {
  return (
    <div className={`relative w-full h-full min-h-[300px] rounded-xl overflow-hidden bg-muted/20 ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
            <div className="mb-2 flex justify-center">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-accent animate-pulse" />
            </div>
            <p className="text-sm font-medium">3D Element Placeholder</p>
            <p className="text-xs opacity-70">Spline / Three.js Scene</p>
        </div>
      </div>
      {/* In a real implementation, we would lazy load Spline here */}
      {/* <Spline scene={url} /> */}
    </div>
  );
};
