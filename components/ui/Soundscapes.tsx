import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Wind, Coffee } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/utils';

export const Soundscapes = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState<'rain' | 'forest' | 'cafe'>('rain');

  // In a real app, these would be actual audio file paths
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className={cn(
        "bg-card/80 backdrop-blur-md border rounded-full p-2 flex items-center gap-2 shadow-lg transition-all duration-300",
        isPlaying ? "w-auto px-4" : "w-10 h-10 justify-center overflow-hidden"
      )}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full hover:bg-primary/20"
          onClick={togglePlay}
        >
          {isPlaying ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
        </Button>

        {isPlaying && (
            <div className="flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-6 w-6 rounded-full", activeSound === 'rain' && "bg-primary/20 text-primary")}
                    onClick={() => setActiveSound('rain')}
                >
                    <CloudRain className="h-3 w-3" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-6 w-6 rounded-full", activeSound === 'forest' && "bg-primary/20 text-primary")}
                    onClick={() => setActiveSound('forest')}
                >
                    <Wind className="h-3 w-3" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-6 w-6 rounded-full", activeSound === 'cafe' && "bg-primary/20 text-primary")}
                    onClick={() => setActiveSound('cafe')}
                >
                    <Coffee className="h-3 w-3" />
                </Button>
            </div>
        )}
      </div>
    </div>
  );
};
