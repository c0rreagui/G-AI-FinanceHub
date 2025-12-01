import React from 'react';
import { cn } from '@/utils/utils';

interface MasonryGridProps {
  children: React.ReactNode[];
  columns?: number;
  gap?: number;
  className?: string;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ 
  children, 
  columns = 3, 
  gap = 4,
  className 
}) => {
  const getColumns = () => {
    const cols: React.ReactNode[][] = Array.from({ length: columns }, () => []);
    
    React.Children.forEach(children, (child, index) => {
      cols[index % columns].push(child);
    });
    
    return cols;
  };

  return (
    <div 
      className={cn("flex w-full", className)} 
      style={{ gap: `${gap * 0.25}rem` }}
    >
      {getColumns().map((col, i) => (
        <div key={i} className="flex flex-col flex-1" style={{ gap: `${gap * 0.25}rem` }}>
          {col}
        </div>
      ))}
    </div>
  );
};
