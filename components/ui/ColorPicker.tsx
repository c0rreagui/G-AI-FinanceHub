import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Button } from './Button';
import { cn } from '../../utils/utils';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

const PRESETS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, className }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("w-full justify-start text-left font-normal px-3", className)}
        >
          <div className="w-4 h-4 rounded-full mr-2 border" style={{ backgroundColor: color }} />
          <span>{color}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-6 gap-2 mb-4">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center transition-transform hover:scale-110",
                color === preset && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: preset }}
              onClick={() => onChange(preset)}
            >
              {color === preset && <Check className="h-4 w-4 text-white drop-shadow-md" />}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
            <input 
                type="color" 
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="h-9 w-9 p-0 border-0 rounded-md cursor-pointer"
            />
            <input 
                type="text" 
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 h-9 px-3 rounded-md border bg-transparent text-sm"
            />
        </div>
      </PopoverContent>
    </Popover>
  );
};
