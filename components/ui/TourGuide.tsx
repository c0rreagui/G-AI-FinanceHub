import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  target: string;
  title: string;
  content: string;
}

interface TourGuideProps {
  steps: Step[];
  isOpen: boolean;
  onClose: () => void;
}

export const TourGuide: React.FC<TourGuideProps> = ({ steps, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || steps.length === 0) return;

    const updatePosition = () => {
      const element = document.getElementById(steps[currentStep].target);
      if (!element) return;

      // Ensure element is visible
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Small delay to wait for scroll to finish
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const tooltipHeight = tooltipRef.current?.offsetHeight || 180;
        const tooltipWidth = 300;

        let top = rect.bottom + window.scrollY + 12;
        let left = rect.left + window.scrollX + (rect.width / 2);
        let currentPlacement: 'top' | 'bottom' = 'bottom';

        // Check vertical space
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < tooltipHeight + 20) {
          top = rect.top + window.scrollY - tooltipHeight - 12;
          currentPlacement = 'top';
        }

        // Horizontal constraints
        const minLeft = (tooltipWidth / 2) + 12;
        const maxLeft = window.innerWidth - (tooltipWidth / 2) - 12;
        left = Math.max(minLeft, Math.min(maxLeft, left));

        setCoords({ top, left });
        setPlacement(currentPlacement);
      }, 100);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, currentStep, steps]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {/* Overlay Backdrop - Higher Z than common components */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[9998]"
        onClick={onClose}
      />

      <motion.div
        ref={tooltipRef}
        initial={{ opacity: 0, scale: 0.9, y: placement === 'bottom' ? -10 : 10 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          top: coords.top,
          left: coords.left
        }}
        className="absolute z-[9999] w-[300px] pointer-events-auto"
        style={{ transform: 'translateX(-50%)' }}
      >
        <Card className="shadow-2xl border-primary/50 ring-4 ring-primary/10 bg-card text-card-foreground">
          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-card border-l border-t border-primary/50 ${placement === 'bottom' ? '-top-2' : '-bottom-2'
              }`}
          />

          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              {steps[currentStep].title}
              <span className="text-xs font-normal text-muted-foreground">
                {currentStep + 1} / {steps.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {steps[currentStep].content}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t border-white/5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="text-xs"
            >
              Anterior
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
                Pular
              </Button>
              <Button size="sm" onClick={handleNext} className="text-xs px-4">
                {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
};
