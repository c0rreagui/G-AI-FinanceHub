import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { formatCurrency } from '../../../utils/formatters';

interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for recharts 3.x
}

interface ExpenseDonutChartProps {
  data: ExpenseCategory[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-2 rounded-lg shadow-lg text-xs">
        <p className="font-medium text-popover-foreground">{payload[0].name}</p>
        <p className="text-primary font-bold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export const ExpenseDonutChart: React.FC<ExpenseDonutChartProps> = ({ data }) => {
  const hasData = data.some(d => d.value > 0);

  if (!hasData) {
    return (
      <Card className="h-full flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground text-sm">Sem dados de despesas.</p>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col min-h-[300px]">
      <CardHeader>
        <CardTitle className="text-lg">Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value) => <span className="text-xs font-medium text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
