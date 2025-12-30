import React from 'react';
import { cn } from '../../utils/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    cols?: number | { [key: string]: number };
    gap?: string | number;
}

export const Grid: React.FC<GridProps> = ({ children, className, cols = 1, gap = 4, ...props }) => {
    const getColsClass = (c: number | { [key: string]: number }) => {
        if (typeof c === 'number') return `grid-cols-${c}`;
        // Simple handling for responsive object if needed, but for now let's stick to className for complex responsive
        return '';
    };

    return (
        <div 
            className={cn(
                'grid', 
                typeof cols === 'number' ? `grid-cols-${cols}` : '',
                `gap-${gap}`,
                className
            )} 
            {...props}
        >
            {children}
        </div>
    );
};
