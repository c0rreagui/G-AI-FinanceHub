import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/utils';
import { GripVertical } from 'lucide-react';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  defaultSplit?: number; // Percentage 0-100
  className?: string;
}

export const SplitPane: React.FC<SplitPaneProps> = ({
  left,
  right,
  minLeftWidth = 200,
  maxLeftWidth = 800,
  defaultSplit = 30,
  className
}) => {
  const [split, setSplit] = useState(defaultSplit);
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      const totalWidth = containerRect.width;
      
      let newSplit = (newWidth / totalWidth) * 100;
      
      // Convert min/max px to percentage approx or handle in px logic
      // For simplicity, we'll just clamp percentage
      if (newSplit < 10) newSplit = 10;
      if (newSplit > 90) newSplit = 90;
      
      setSplit(newSplit);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResizing = () => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div ref={containerRef} className={cn("flex h-full w-full overflow-hidden", className)}>
      <div style={{ width: `${split}%` }} className="h-full overflow-auto">
        {left}
      </div>
      <div
        className="w-1 bg-border hover:bg-primary cursor-col-resize flex items-center justify-center z-10 transition-colors"
        onMouseDown={startResizing}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div style={{ width: `${100 - split}%` }} className="h-full overflow-auto">
        {right}
      </div>
    </div>
  );
};
