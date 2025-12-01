import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TourGuideProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const TourGuide: React.FC<TourGuideProps> = ({ steps, isOpen, onClose, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (isOpen && steps[currentStepIndex]) {
      const target = document.getElementById(steps[currentStepIndex].targetId);
      if (target) {
        const rect = target.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isOpen, currentStepIndex, steps]);

  if (!isOpen || !position) return null;

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop with hole */}
        <div className="absolute inset-0 bg-black/60 clip-path-hole" style={{
           clipPath: `polygon(
             0% 0%, 
             0% 100%, 
             ${position.left}px 100%, 
             ${position.left}px ${position.top}px, 
             ${position.left + position.width}px ${position.top}px, 
             ${position.left + position.width}px ${position.top + position.height}px, 
             ${position.left}px ${position.top + position.height}px, 
             ${position.left}px 100%, 
             100% 100%, 
             100% 0%
           )`
        }}></div>

        {/* Highlight Border */}
        <motion.div
           layoutId="tour-highlight"
           {...({ className: "absolute border-2 border-cyan-500 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.5)] pointer-events-none" } as any)}
           style={{
             top: position.top - 4,
             left: position.left - 4,
             width: position.width + 8,
             height: position.height + 8,
           }}
           transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        {/* Tooltip Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={currentStepIndex}
          {...({ className: "absolute max-w-sm w-full" } as any)}
          style={{
             top: position.top + position.height + 20, // Simple positioning below for now
             left: position.left,
          }}
        >
          <Card className="border-cyan-500/30 bg-card/95 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-primary">{currentStep.title}</h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{currentStep.content}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Passo {currentStepIndex + 1} de {steps.length}
                </span>
                <Button size="sm" onClick={handleNext}>
                  {isLastStep ? 'Concluir' : 'Próximo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
