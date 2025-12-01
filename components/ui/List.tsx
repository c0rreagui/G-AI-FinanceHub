import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const listVariants = cva('text-sm', {
  variants: {
    variant: {
      default: 'list-disc pl-5 space-y-1',
      decimal: 'list-decimal pl-5 space-y-1',
      none: 'list-none pl-0 space-y-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ListProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof listVariants> {
  as?: 'ul' | 'ol';
}

const List = forwardRef<any, ListProps>(
  ({ className, variant, as = 'ul', ...props }, ref) => {
    const Component = as;
    return (
      <Component
        ref={ref}
        className={cn(listVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
List.displayName = 'List';

const ListItem = forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
ListItem.displayName = 'ListItem';

export { List, ListItem };
