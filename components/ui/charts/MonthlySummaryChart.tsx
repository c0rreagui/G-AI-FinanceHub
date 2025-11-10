import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MonthlyChartData } from '../../../types';
import { formatCurrencyBRL } from '../../../utils/formatters';

interface MonthlySummaryChartProps {
    data: MonthlyChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/50 border border-white/20 backdrop-blur-md p-3 rounded-lg text-sm">
          <p className="label font-semibold text-white">{`${label}`}</p>
          <p className="text-green-400">{`Receita: ${formatCurrencyBRL(payload[0].value)}`}</p>
          <p className="text-red-400">{`Despesa: ${formatCurrencyBRL(payload[1].value)}`}</p>
        </div>
      );
    }
  
    return null;
  };

export const MonthlySummaryChart: React.FC<MonthlySummaryChartProps> = ({ data }) => {
    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 h-80">
            <h3 className="text-lg font-semibold text-white mb-4">Resumo dos Últimos 6 Meses</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#9ca3af', fontSize: 12 }} 
                        stroke="rgba(255, 255, 255, 0.2)" 
                    />
                    <YAxis 
                        tickFormatter={(value) => `R$${Number(value) / 1000}k`}
                        tick={{ fill: '#9ca3af', fontSize: 12 }} 
                        stroke="rgba(255, 255, 255, 0.2)"
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                    <Legend 
                        wrapperStyle={{ bottom: 0, left: 20 }}
                        iconType="circle"
                        formatter={(value) => <span className="text-gray-300">{value}</span>}
                    />
                    <Bar dataKey="receita" fill="#22c55e" name="Receita" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="despesa" fill="#ef4444" name="Despesa" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
