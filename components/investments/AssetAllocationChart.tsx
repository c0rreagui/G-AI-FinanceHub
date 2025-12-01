import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Investment, InvestmentType } from '../../types';

interface AssetAllocationChartProps {
  investments: Investment[];
}

const COLORS = {
  [InvestmentType.RENDA_FIXA]: '#10b981', // Emerald
  [InvestmentType.ACOES]: '#3b82f6', // Blue
  [InvestmentType.FIIS]: '#f59e0b', // Amber
  [InvestmentType.CRIPTO]: '#8b5cf6', // Violet
  [InvestmentType.EXTERIOR]: '#ec4899', // Pink
  [InvestmentType.OUTROS]: '#6b7280', // Gray
};

const LABELS = {
  [InvestmentType.RENDA_FIXA]: 'Renda Fixa',
  [InvestmentType.ACOES]: 'Ações',
  [InvestmentType.FIIS]: 'FIIs',
  [InvestmentType.CRIPTO]: 'Cripto',
  [InvestmentType.EXTERIOR]: 'Exterior',
  [InvestmentType.OUTROS]: 'Outros',
};

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ investments }) => {
  const data = React.useMemo(() => {
    const allocation = investments.reduce((acc, inv) => {
      acc[inv.type] = (acc[inv.type] || 0) + Number(inv.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(allocation)
      .map(([type, value]) => ({
        name: LABELS[type as InvestmentType] || type,
        value,
        color: COLORS[type as InvestmentType] || '#cbd5e1',
      }))
      .sort((a, b) => b.value - a.value);
  }, [investments]);

  if (investments.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Sem dados para exibir
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
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
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.1)" />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
            itemStyle={{ color: '#f3f4f6' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
