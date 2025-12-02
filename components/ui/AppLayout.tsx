import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/utils';

// --- Box ---
export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

const Box = forwardRef<HTMLDivElement, BoxProps>(({ className, as: Component = 'div', ...props }, ref) => {
  return <Component ref={ref} className={cn(className)} {...props} />;
});
Box.displayName = 'Box';

// --- Flex ---
const flexVariants = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      col: 'flex-col',
      rowReverse: 'flex-row-reverse',
      colReverse: 'flex-col-reverse',
    },
    wrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      wrapReverse: 'flex-wrap-reverse',
    },
    justify: {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    align: {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1', // 4px
      sm: 'gap-2', // 8px
      md: 'gap-4', // 16px
      lg: 'gap-6', // 24px
      xl: 'gap-8', // 32px
    },
  },
  defaultVariants: {
    direction: 'row',
    align: 'stretch',
    justify: 'start',
    gap: 'none',
  },
});

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof flexVariants> {
  as?: React.ElementType;
}

const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, wrap, justify, align, gap, as: Component = 'div', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(flexVariants({ direction, wrap, justify, align, gap }), className)}
        {...props}
      />
    );
  }
);
Flex.displayName = 'Flex';

// --- Stack (Vertical Flex by default) ---
// Just a convenience wrapper around Flex with direction="col" default
const Stack = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  return <Flex ref={ref} direction="col" {...props} />;
});
Stack.displayName = 'Stack';

// --- Grid ---
const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
      none: 'grid-cols-none',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    align: {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      stretch: 'items-stretch',
    },
    justify: {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
    },
  },
  defaultVariants: {
    cols: 1,
    gap: 'md',
  },
});

export interface GridProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {
  as?: React.ElementType;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, align, justify, as: Component = 'div', ...props }, ref) => {
    return (
      <Component ref={ref} className={cn(gridVariants({ cols, gap, align, justify }), className)} {...props} />
    );
  }
);
Grid.displayName = 'Grid';

// --- Container ---
const containerVariants = cva('mx-auto w-full px-4 md:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    size: 'xl',
  },
});

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {
  as?: React.ElementType;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ className, size, as: Component = 'div', ...props }, ref) => {
  return <Component ref={ref} className={cn(containerVariants({ size }), className)} {...props} />;
});
Container.displayName = 'Container';

export { Box, Flex, Stack, Grid, Container };
