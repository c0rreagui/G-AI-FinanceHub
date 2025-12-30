import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { cn } from '@/utils/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatisticCardProps {
  title: string;
  value: string;
  trend?: number;
  data?: number[]; // Simple array for sparkline
  className?: string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({ title, value, trend, data, className }) => {
  const isPositive = trend && trend > 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center text-xs font-medium",
            isPositive ? "text-green-500" : "text-red-500"
          )}>
            {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {data && (
          <div className="mt-4 h-10 flex items-end gap-1 opacity-50">
            {data.map((h, i) => (
              <div 
                key={i} 
                className="bg-primary flex-1 rounded-t-sm transition-all hover:bg-primary/80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
