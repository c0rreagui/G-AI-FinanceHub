import React from 'react';
import { cn } from '@/utils/utils';

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({ children, className }) => {
  return (
    <kbd className={cn(
      "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100",
      className
    )}>
      {children}
    </kbd>
  );
};
