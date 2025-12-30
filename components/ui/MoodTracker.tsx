import React, { useState } from 'react';
import { Smile, Meh, Frown, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/utils';

export const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<'good' | 'neutral' | 'bad' | null>(null);

  return (
    <div className="bg-card border rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3">Como você se sente com suas finanças hoje?</h3>
      
      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          className={cn(
            "flex-1 flex-col h-auto py-3 gap-2 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/50",
            selectedMood === 'good' && "bg-green-500/20 text-green-500 border-green-500"
          )}
          onClick={() => setSelectedMood('good')}
        >
          <Smile className="h-6 w-6" />
          <span className="text-xs">Confiante</span>
        </Button>
        
        <Button
          variant="outline"
          className={cn(
            "flex-1 flex-col h-auto py-3 gap-2 hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500/50",
            selectedMood === 'neutral' && "bg-yellow-500/20 text-yellow-500 border-yellow-500"
          )}
          onClick={() => setSelectedMood('neutral')}
        >
          <Meh className="h-6 w-6" />
          <span className="text-xs">Neutro</span>
        </Button>
        
        <Button
          variant="outline"
          className={cn(
            "flex-1 flex-col h-auto py-3 gap-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50",
            selectedMood === 'bad' && "bg-red-500/20 text-red-500 border-red-500"
          )}
          onClick={() => setSelectedMood('bad')}
        >
          <Frown className="h-6 w-6" />
          <span className="text-xs">Preocupado</span>
        </Button>
      </div>

      {selectedMood && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground animate-in fade-in slide-in-from-top-2">
          {selectedMood === 'good' && "Ótimo! Continue mantendo o controle."}
          {selectedMood === 'neutral' && "Tudo bem. Revise seus gastos para ter mais clareza."}
          {selectedMood === 'bad' && "Não desanime. Vamos analisar onde podemos economizar."}
        </div>
      )}
    </div>
  );
};
