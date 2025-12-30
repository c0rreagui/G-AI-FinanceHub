import React from 'react';
import { cn } from '@/utils/utils';

interface PasswordStrengthMeterProps {
  password?: string;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password = '', 
  className 
}) => {
  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 6) score += 1;
    if (pass.length > 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const score = getStrength(password);

  const getColor = (score: number) => {
    if (score === 0) return 'bg-gray-700';
    if (score <= 2) return 'bg-red-500';
    if (score <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getLabel = (score: number) => {
    if (score === 0) return 'Muito fraca';
    if (score <= 2) return 'Fraca';
    if (score <= 4) return 'Média';
    return 'Forte';
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Força da senha</span>
        <span className={cn("font-medium", {
            'text-red-500': score > 0 && score <= 2,
            'text-yellow-500': score > 2 && score <= 4,
            'text-green-500': score === 5
        })}>
          {password ? getLabel(score) : 'Digite a senha'}
        </span>
      </div>
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-full flex-1 rounded-full transition-all duration-300",
              score >= level ? getColor(score) : "bg-secondary/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};
