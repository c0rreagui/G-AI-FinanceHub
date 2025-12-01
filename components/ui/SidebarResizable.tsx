import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/utils';
import { GripVertical } from 'lucide-react';

interface SidebarResizableProps {
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  className?: string;
}

export const SidebarResizable: React.FC<SidebarResizableProps> = ({ 
  children, 
  minWidth = 200, 
  maxWidth = 480, 
  defaultWidth = 250,
  className 
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      
      let newWidth = e.clientX;
      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;
      
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [minWidth, maxWidth]);

  const startResizing = () => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
  };

  return (
    <div 
      className={cn("relative flex h-full border-r bg-card transition-all duration-75 ease-out", className)}
      style={{ width }}
    >
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors flex items-center justify-center group z-50"
        onMouseDown={startResizing}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};
