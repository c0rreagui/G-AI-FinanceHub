import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/utils';

// --- Heading ---
const headingVariants = cva('font-heading font-bold tracking-tight text-foreground', {
  variants: {
    size: {
      h1: 'text-4xl md:text-5xl lg:text-6xl',
      h2: 'text-3xl md:text-4xl',
      h3: 'text-2xl md:text-3xl',
      h4: 'text-xl md:text-2xl',
      h5: 'text-lg md:text-xl',
      h6: 'text-base md:text-lg',
    },
    weight: {
      default: 'font-bold',
      medium: 'font-medium',
      semibold: 'font-semibold',
      extrabold: 'font-extrabold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    size: 'h2',
    weight: 'default',
    align: 'left',
  },
});

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, weight, align, as, ...props }, ref) => {
    const Component = as || (size as any) || 'h2'; // Default to size if as is not provided, else h2
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ size, weight, align }), className)}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

// --- Text ---
const textVariants = cva('font-sans text-foreground', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-accent',
      primary: 'text-primary',
      danger: 'text-destructive',
      success: 'text-success',
      warning: 'text-warning',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    variant: 'default',
    align: 'left',
  },
});

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof textVariants> {
  as?: React.ElementType;
}

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, variant, align, as: Component = 'span', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ size, weight, variant, align }), className)}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

// --- Paragraph ---
const paragraphVariants = cva('font-sans leading-7 [&:not(:first-child)]:mt-6', {
  variants: {
    size: {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    },
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    size: 'base',
    variant: 'default',
  },
});

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof paragraphVariants> {}

const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(paragraphVariants({ size, variant }), className)}
        {...props}
      />
    );
  }
);
Paragraph.displayName = 'Paragraph';

// --- Code (Monospace) ---
const codeVariants = cva('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', {
    variants: {
        variant: {
            default: 'text-foreground',
            ghost: 'bg-transparent',
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});

export interface CodeProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof codeVariants> {}

const Code = forwardRef<HTMLElement, CodeProps>(({ className, variant, ...props }, ref) => {
    return (
        <code ref={ref} className={cn(codeVariants({ variant }), className)} {...props} />
    )
})
Code.displayName = 'Code';


export { Heading, Text, Paragraph, Code };
