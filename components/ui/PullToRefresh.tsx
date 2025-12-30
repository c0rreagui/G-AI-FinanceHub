import React, { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children, className }) => {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const THRESHOLD = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY > 0 && !isRefreshing) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      if (diff > 0) {
        setPullDistance(Math.min(diff * 0.5, 120)); // Resistance
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(60); // Snap to loading position
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
    setStartY(0);
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-y-auto h-full", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center items-center pointer-events-none transition-all duration-200"
        style={{ height: pullDistance, opacity: pullDistance / THRESHOLD }}
      >
        <Loader2 className={cn("h-6 w-6 text-primary", isRefreshing && "animate-spin")} />
      </div>
      <div 
        className="transition-transform duration-200"
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {children}
      </div>
    </div>
  );
};
