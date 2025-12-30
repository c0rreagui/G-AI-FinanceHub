import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/utils';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "fixed bottom-20 right-4 z-50 rounded-full shadow-lg transition-all duration-300 hover:scale-110 md:bottom-8",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
      onClick={scrollToTop}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};
