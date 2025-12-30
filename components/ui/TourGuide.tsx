import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';

interface Step {
  target: string; // ID of the target element
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
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const target = document.getElementById(steps[currentStep].target);
      if (target && tooltipRef.current) {
        const rect = target.getBoundingClientRect();
        const tooltipHeight = tooltipRef.current.offsetHeight || 200;
        const tooltipWidth = tooltipRef.current.offsetWidth || 300;

        // Calculate vertical position
        let top = rect.bottom + globalThis.scrollY + 12;
        const spaceBelow = globalThis.innerHeight - rect.bottom;

        // If not enough space below, place above
        if (spaceBelow < tooltipHeight + 20) {
          top = rect.top + globalThis.scrollY - tooltipHeight - 12;
        }

        // Calculate horizontal position
        let left = rect.left + globalThis.scrollX + rect.width / 2;

        // Horizontal constraints (keep inside viewport)
        const minLeft = (tooltipWidth / 2) + 12;
        const maxLeft = globalThis.innerWidth - (tooltipWidth / 2) - 12;
        left = Math.max(minLeft, Math.min(maxLeft, left));

        tooltipRef.current.style.top = `${top}px`;
        tooltipRef.current.style.left = `${left}px`;
        tooltipRef.current.style.transform = 'translateX(-50%)';

        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // Use requestAnimationFrame with a small delay to ensure DOM is ready and animations are settled
    const timer = setTimeout(() => {
      requestAnimationFrame(updatePosition);
    }, 100);

    globalThis.addEventListener('resize', updatePosition);
    return () => {
      globalThis.removeEventListener('resize', updatePosition);
      clearTimeout(timer);
    };
  }, [currentStep, isOpen, steps]);

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
      <div
        className="fixed inset-0 bg-black/50 z-[500]"
        onClick={onClose}
        role="button"
        aria-label="Fechar tour"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
      />
      <div
        ref={tooltipRef}
        className="absolute z-[500] transition-all duration-300 ease-in-out"
      >
        <Card className="w-[300px] shadow-2xl border-primary/50 ring-4 ring-primary/20 bg-popover text-popover-foreground">
          <CardHeader>
            <CardTitle className="text-lg">{steps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{steps[currentStep].content}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" size="sm" onClick={handlePrev} disabled={currentStep === 0}>
              Anterior
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>Pular</Button>
              <Button size="sm" onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
