import React from 'react';
import { cn } from '../../utils/utils';

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: string | number;
}

export const Flex: React.FC<FlexProps> = ({ 
    children, 
    className, 
    direction = 'row', 
    justify = 'start', 
    align = 'stretch', 
    wrap = 'nowrap', 
    gap = 0, 
    ...props 
}) => {
    const directionClass = {
        'row': 'flex-row',
        'col': 'flex-col',
        'row-reverse': 'flex-row-reverse',
        'col-reverse': 'flex-col-reverse',
    }[direction];

    const justifyClass = {
        'start': 'justify-start',
        'end': 'justify-end',
        'center': 'justify-center',
        'between': 'justify-between',
        'around': 'justify-around',
        'evenly': 'justify-evenly',
    }[justify];

    const alignClass = {
        'start': 'items-start',
        'end': 'items-end',
        'center': 'items-center',
        'baseline': 'items-baseline',
        'stretch': 'items-stretch',
    }[align];

    const wrapClass = {
        'nowrap': 'flex-nowrap',
        'wrap': 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
    }[wrap];

    return (
        <div 
            className={cn(
                'flex', 
                directionClass, 
                justifyClass, 
                alignClass, 
                wrapClass, 
                gap ? `gap-${gap}` : '',
                className
            )} 
            {...props}
        >
            {children}
        </div>
    );
};
