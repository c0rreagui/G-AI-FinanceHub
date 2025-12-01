import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/utils';

interface StickyHeaderProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({ children, className, offset = 0 }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > offset) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isSticky ? "bg-background/80 backdrop-blur-md border-b shadow-sm" : "bg-transparent",
        className
      )}
    >
      {children}
    </header>
  );
};
