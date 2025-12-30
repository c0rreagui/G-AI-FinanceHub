import React from 'react';
import { Card } from '../ui/Card';
import { CircularProgress } from '../ui/CircularProgress';
import { Button } from '../ui/Button';
import { ChevronRight, Target } from 'lucide-react';
import { ViewType } from '../../types';

interface GoalsWidgetProps {
  setCurrentView: (view: ViewType) => void;
}

export const GoalsWidget: React.FC<GoalsWidgetProps> = ({ setCurrentView }) => {
  // Mock data - replace with real data hook later
  const mainGoal = {
    name: "Viagem Disney",
    current: 12500,
    target: 25000,
    percentage: 50,
    color: "text-accent"
  };

  return (
    <Card className="p-4 flex flex-col h-full hover:shadow-glow transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Target className="w-4 h-4 text-accent" />
          </div>
          <h3 className="font-semibold text-sm">Meta Principal</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => setCurrentView('goals')}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-1">
        <CircularProgress 
          value={mainGoal.percentage} 
          size={60} 
          strokeWidth={6} 
          color={mainGoal.color}
          showValue
        />
        <div className="flex flex-col">
          <span className="font-medium text-sm">{mainGoal.name}</span>
          <span className="text-xs text-muted-foreground">
            R$ {mainGoal.current.toLocaleString('pt-BR')} de R$ {mainGoal.target.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>
    </Card>
  );
};
