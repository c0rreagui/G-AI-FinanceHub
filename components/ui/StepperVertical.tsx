import React from 'react';
import { cn } from '@/utils/utils';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  description?: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface StepperVerticalProps {
  steps: Step[];
  className?: string;
}

export const StepperVertical: React.FC<StepperVerticalProps> = ({ steps, className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <div key={step.title} className="relative flex gap-4">
          {index !== steps.length - 1 && (
            <div 
              className={cn(
                "absolute left-[15px] top-8 bottom-[-16px] w-0.5",
                step.status === 'complete' ? "bg-primary" : "bg-muted"
              )} 
            />
          )}
          <div className={cn(
            "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            step.status === 'complete' ? "border-primary bg-primary text-primary-foreground" :
            step.status === 'current' ? "border-primary bg-background text-primary" :
            "border-muted bg-background text-muted-foreground"
          )}>
            {step.status === 'complete' ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
          </div>
          <div className="flex flex-col pt-1 pb-6">
            <span className={cn(
              "text-sm font-medium leading-none",
              step.status === 'upcoming' && "text-muted-foreground"
            )}>
              {step.title}
            </span>
            {step.description && (
              <span className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
