import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { AnimatedCurrency } from '../ui/AnimatedCurrency';
import { cn } from '../../utils/utils';
import { formatCurrency } from '../../utils/formatters';
import { usePrivacy } from '../../contexts/PrivacyContext';
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
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
    <Card className={cn(
      "relative overflow-hidden group shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] border-white/10",
      "bg-gradient-to-br from-violet-500/10 via-background to-background",
      className
    )}>
      {/* Aurora Glow Background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/15 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
      
      {/* Sparkline Background */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-25 pointer-events-none overflow-visible">
        <svg viewBox="-10 -5 120 30" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
          <path 
            d="M-5 15 Q 10 10, 20 12 T 40 8 T 60 14 T 80 5 T 100 10 T 120 8" 
            fill="none" 
            stroke="url(#sparklineGradient)" 
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(0 0 4px rgba(139, 92, 246, 0.5))"
          />
          <path 
            d="M-5 15 Q 10 10, 20 12 T 40 8 T 60 14 T 80 5 T 100 10 T 120 8 V 35 H -5 Z" 
            fill="url(#sparklineGradient)"
            fillOpacity="0.1"
          />
        </svg>
      </div>
      
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Saldo Total
          </CardTitle>
        </div>
        <button 
            onClick={togglePrivacyMode} 
            className="text-muted-foreground/50 hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
            title={isPrivacyMode ? "Mostrar valores" : "Ocultar valores"}
        >
            {isPrivacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div 
            className={cn(
                "text-4xl md:text-5xl font-extrabold tracking-tight tabular-nums transition-all duration-300",
                isPrivacyMode && "blur-md select-none"
            )} 
            title={isPrivacyMode ? undefined : formatCurrency(balance)}
        >
          <span className={cn(
            isPrivacyMode ? "text-foreground" : "bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]"
          )}>
            <AnimatedCurrency 
                value={balance} 
                className=""
            />
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className={cn(
                            "flex items-center text-sm font-semibold px-3 py-1 rounded-full cursor-help transition-all",
                            isPositive 
                              ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25" 
                              : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                        )}>
                            {isPositive ? <TrendingUp className="w-4 h-4 mr-1.5" /> : <TrendingDown className="w-4 h-4 mr-1.5" />}
                            {isPositive ? '+' : ''}{Math.abs(trend).toFixed(1)}%
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        {isPositive ? "Aumento" : "Queda"} em relação ao mês anterior
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <span className="text-sm text-muted-foreground">vs. mês anterior</span>
        </div>
      </CardContent>
    </Card>
  );
};

