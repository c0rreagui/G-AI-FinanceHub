import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './Card';
import { cn } from '@/utils/utils';

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
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const target = document.getElementById(steps[currentStep].target);
      if (target) {
        const rect = target.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 10,
          left: rect.left + window.scrollX,
        });
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
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
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div 
        className="absolute z-50 transition-all duration-300 ease-in-out"
        style={{ top: position.top, left: position.left }}
      >
        <Card className="w-[300px] shadow-2xl border-primary/50 ring-4 ring-primary/20">
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
