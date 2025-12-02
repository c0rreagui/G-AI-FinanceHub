import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { formatCurrency } from '../../../utils/formatters';
import { MonthlyChartData } from '../../../types';

interface CashFlowBarChartProps {
  data: MonthlyChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-2 rounded-lg shadow-lg text-xs">
        <p className="font-medium mb-1 text-popover-foreground">{label}</p>
        <p className="text-emerald-500">Receita: {formatCurrency(payload[0].value)}</p>
        <p className="text-rose-500">Despesa: {formatCurrency(payload[1].value)}</p>
      </div>
    );
  }
  return null;
};

export const CashFlowBarChart: React.FC<CashFlowBarChartProps> = ({ data }) => {
  return (
    <Card className="h-full flex flex-col min-h-[300px]">
      <CardHeader>
        <CardTitle className="text-lg">Fluxo de Caixa (Barras)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(value) => `R$${value/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.2)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="receita" name="Receita" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="despesa" name="Despesa" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
