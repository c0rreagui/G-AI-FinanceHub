import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { MonthlyChartData } from '../../../types';
import { formatCurrencyBRL } from '../../../utils/formatters';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

interface MonthlySummaryChartProps {
    data: MonthlyChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-slate-700 backdrop-blur-xl p-3 rounded-xl shadow-2xl text-xs">
          <p className="text-slate-300 mb-2 font-bold">{label}</p>
          <div className="space-y-1">
              <p className="text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"/>
                  Receita: <span className="font-mono font-bold text-white">{formatCurrencyBRL(payload[0].value)}</span>
              </p>
              <p className="text-rose-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]"/>
                  Despesa: <span className="font-mono font-bold text-white">{formatCurrencyBRL(payload[1].value)}</span>
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
            <div className="flex items-center justify-between mb-4">
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
                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                        />
                        <YAxis 
                            tickFormatter={(value) => `R$${Number(value)/1000}k`}
                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} 
                            axisLine={false}
                            tickLine={false}
                            width={40}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Legend 
                            verticalAlign="top" 
                            align="right" 
                            iconType="circle"
                            wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 600 }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="receita" 
                            name="Receitas"
                            stroke="#34d399" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorReceita)" 
                            dot={{ r: 4, fill: '#34d399', strokeWidth: 2, stroke: '#0f172a' }}
                            activeDot={{ r: 6, fill: '#34d399', stroke: '#fff', strokeWidth: 2 }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="despesa" 
                            name="Despesas"
                            stroke="#fb7185" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorDespesa)" 
                            dot={{ r: 4, fill: '#fb7185', strokeWidth: 2, stroke: '#0f172a' }}
                            activeDot={{ r: 6, fill: '#fb7185', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};