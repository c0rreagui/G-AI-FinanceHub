/* eslint-disable react-dom/no-unsafe-inline-style */
import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { Progress } from './Progress';

interface GamificationProps {
  level: number;
  currentXP: number;
  nextLevelXP: number;
}

export const Gamification: React.FC<GamificationProps> = ({ level, currentXP, nextLevelXP }) => {
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <div className="bg-card border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500/20 p-1.5 rounded-lg">
            <Trophy className="h-4 w-4 text-yellow-500" />
          </div>
          <span className="font-bold text-sm">Nível {level}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <span>{currentXP} / {nextLevelXP} XP</span>
        </div>
      </div>
      
      <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500 ease-out"
            // eslint-disable-next-line
            style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Faltam {nextLevelXP - currentXP} XP para o próximo nível!
      </p>
    </div>
  );
};
