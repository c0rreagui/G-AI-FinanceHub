import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { ViewType } from '../../../types';

interface InvestmentsWidgetProps {
  setCurrentView: (view: ViewType) => void;
}

export const InvestmentsWidget: React.FC<InvestmentsWidgetProps> = ({ setCurrentView }) => {
  // Mock data - replace with real data hook later
  const portfolio = {
    total: 15420.50,
    yield: 2.4,
    isPositive: true
  };

  return (
    <Card className="p-4 flex flex-col h-full hover:shadow-glow transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-success/10 rounded-lg">
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <h3 className="font-semibold text-sm">Investimentos</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => setCurrentView('investments')} // Assuming 'investments' view exists or will exist
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-1 flex-1 justify-center">
        <span className="text-2xl font-bold tracking-tight">
          R$ {portfolio.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
        <div className="flex items-center gap-1 text-xs font-medium">
          {portfolio.isPositive ? (
            <TrendingUp className="w-3 h-3 text-success" />
          ) : (
            <TrendingDown className="w-3 h-3 text-destructive" />
          )}
          <span className={portfolio.isPositive ? 'text-success' : 'text-destructive'}>
            {portfolio.isPositive ? '+' : ''}{portfolio.yield}%
          </span>
          <span className="text-muted-foreground ml-1">este mês</span>
        </div>
      </div>
    </Card>
  );
};
