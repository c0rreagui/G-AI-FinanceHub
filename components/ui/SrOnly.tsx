import React from 'react';
import { cn } from '@/utils/utils';

export const SrOnly: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <span className={cn("sr-only", className)}>
      {children}
    </span>
  );
};
