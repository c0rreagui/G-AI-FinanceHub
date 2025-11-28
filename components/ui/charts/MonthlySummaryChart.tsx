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
        <div className="bg-[oklch(var(--card-oklch))] border border-white/10 backdrop-blur-xl p-3 rounded-xl shadow-2xl text-xs">
          <p className="text-slate-400 mb-2 font-bold">{label}</p>
          <div className="space-y-1">
              <p className="text-[oklch(var(--success-oklch))] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[oklch(var(--success-oklch))]"/>
                  Receita: <span className="font-mono font-bold">{formatCurrencyBRL(payload[0].value)}</span>
              </p>
              <p className="text-[oklch(var(--danger-oklch))] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[oklch(var(--danger-oklch))]"/>
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
        <div className="card h-full flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"/>
                    Fluxo Financeiro
                </h3>
            </div>
            
            <div className="flex-grow w-full -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="oklch(var(--success-oklch))" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="oklch(var(--success-oklch))" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="oklch(var(--danger-oklch))" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="oklch(var(--danger-oklch))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} 
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                        />
                        <YAxis 
                            tickFormatter={(value) => `R$${Number(value)/1000}k`}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} 
                            axisLine={false}
                            tickLine={false}
                            width={40}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area 
                            type="monotone" 
                            dataKey="receita" 
                            stroke="oklch(var(--success-oklch))" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorReceita)" 
                        />
                        <Area 
                            type="monotone" 
                            dataKey="despesa" 
                            stroke="oklch(var(--danger-oklch))" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorDespesa)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};