import React from 'react';
import { cn } from '@/utils/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps & { children?: React.ReactNode }> = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className,
  children
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center animate-fade-in", className)}>
      {Icon && (
        <div className="mb-4 rounded-full bg-muted/50 p-4 ring-1 ring-white/10">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mb-6 text-sm text-muted-foreground max-w-xs">{description}</p>
      {action}
      {children}
    </div>
  );
};