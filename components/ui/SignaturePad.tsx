import React, { useRef, useState, useEffect } from 'react';
import { Button } from './Button';
import { cn } from '@/utils/utils';
import { Eraser } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  className?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#ffffff'; // Default to white for dark mode
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
      onSave(canvas.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="border rounded-xl overflow-hidden bg-card relative h-40 w-full touch-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground pointer-events-none select-none">
          Assine aqui
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={clear}>
          <Eraser className="h-4 w-4 mr-2" />
          Limpar
        </Button>
      </div>
    </div>
  );
};
