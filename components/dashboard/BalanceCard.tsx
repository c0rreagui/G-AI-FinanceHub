import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { AnimatedCurrency } from '../ui/AnimatedCurrency';
import { cn } from '../../utils/utils';
import { formatCurrency } from '../../utils/formatters';
import { usePrivacy } from '../../contexts/PrivacyContext';
import { Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';

interface BalanceCardProps {
  balance: number;
  className?: string;
  trend?: number; // Percentage change, e.g., 12.5 or -5.2
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, className, trend = 12.5 }) => {
  const { isPrivacyMode, togglePrivacyMode } = usePrivacy();
  const isPositive = trend >= 0;

  return (
    <Card className={cn("bg-card border-border relative overflow-hidden group shadow-sm", className)}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      {/* Sparkline Background */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
          <path 
            d="M0 15 Q 10 10, 20 12 T 40 8 T 60 14 T 80 5 T 100 10" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="text-primary"
          />
          <path 
            d="M0 15 Q 10 10, 20 12 T 40 8 T 60 14 T 80 5 T 100 10 V 20 H 0 Z" 
            fill="currentColor" 
            className="text-primary"
            fillOpacity="0.2"
          />
        </svg>
      </div>
      
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Saldo Total</CardTitle>
        <button 
            onClick={togglePrivacyMode} 
            className="text-muted-foreground/50 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
            title={isPrivacyMode ? "Mostrar valores" : "Ocultar valores"}
        >
            {isPrivacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </CardHeader>
      
      <CardContent>
        <div 
            className={cn(
                "text-3xl md:text-4xl font-bold text-foreground tracking-tight tabular-nums truncate transition-all duration-300", 
                isPrivacyMode && "blur-md select-none"
            )} 
            title={isPrivacyMode ? undefined : formatCurrency(balance)}
        >
          <AnimatedCurrency value={balance} />
        </div>

        <div className="mt-2 flex items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={cn(
                            "flex items-center text-xs font-medium px-2 py-0.5 rounded-full cursor-help",
                            isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        )}>
                            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {Math.abs(trend)}%
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        {isPositive ? "Aumento" : "Queda"} em relação ao mês anterior
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <span className="text-xs text-gray-400">vs. mês anterior</span>
        </div>
      </CardContent>
    </Card>
  );
};
