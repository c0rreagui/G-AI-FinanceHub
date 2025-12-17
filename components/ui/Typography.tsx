import React from 'react';
import { cn } from '@/utils/utils';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'lead' | 'large' | 'small' | 'muted';
  className?: string;
  children: React.ReactNode;
}

const variantStyles = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
};

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'p', 
  className, 
  children 
}) => {
  const Component = variant === 'p' || variant === 'lead' || variant === 'large' || variant === 'small' || variant === 'muted' 
    ? 'p' 
    : variant;

  return (
    <Component className={cn(variantStyles[variant], className)}>
      {children}
    </Component>
  );
};
