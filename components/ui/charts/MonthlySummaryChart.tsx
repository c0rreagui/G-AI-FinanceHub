import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MonthlyChartData } from '../../../types';
import { formatCurrencyBRL } from '../../../utils/formatters';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

interface MonthlySummaryChartProps {
    data: MonthlyChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 border border-white/10 backdrop-blur-xl p-4 rounded-xl shadow-2xl text-sm">
          <p className="text-gray-400 mb-2 font-medium">{label}</p>
          <div className="space-y-1">
              <p className="text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"/>
                  Receita: <span className="font-mono font-bold">{formatCurrencyBRL(payload[0].value)}</span>
              </p>
              <p className="text-rose-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400"/>
                  Despesa: <span className="font-mono font-bold">{formatCurrencyBRL(payload[1].value)}</span>
              </p>
          </div>
        </div>
      );
    }
    return null;
  };

export const MonthlySummaryChart: React.FC<MonthlySummaryChartProps> = ({ data }) => {
    const isMobile = !useMediaQuery('(min-width: 768px)');

    return (
        <div className="card h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"/>
                    Fluxo Financeiro
                </h3>
            </div>
            
            <div className="flex-grow w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="oklch(var(--success-oklch))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="oklch(var(--success-oklch))" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="oklch(var(--danger-oklch))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="oklch(var(--danger-oklch))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                        />
                        <YAxis 
                            tickFormatter={(value) => `R$${Number(value)/1000}k`}
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                        <Area 
                            type="monotone" 
                            dataKey="receita" 
                            stroke="oklch(var(--success-oklch))" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorReceita)" 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="despesa" 
                            stroke="oklch(var(--danger-oklch))" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorDespesa)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};