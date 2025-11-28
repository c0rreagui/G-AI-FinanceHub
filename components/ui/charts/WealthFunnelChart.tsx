import React from 'react';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip, Cell } from 'recharts';
import { formatCurrencyBRL } from '../../../utils/formatters';

interface WealthFunnelChartProps {
    income: number;
    expenses: number;
    investments: number;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-black/90 border border-white/10 backdrop-blur-xl p-3 rounded-xl shadow-xl">
                <p className="font-bold text-white mb-1 text-xs uppercase tracking-wider">{data.name}</p>
                <p className="text-cyan-300 font-mono text-lg font-bold">{formatCurrencyBRL(data.realValue)}</p>
                <p className="text-[10px] text-gray-400 mt-1">{data.percentage}% da Renda</p>
            </div>
        );
    }
    return null;
};

export const WealthFunnelChart: React.FC<WealthFunnelChartProps> = ({ income, expenses, investments }) => {
    const safeIncome = income > 0 ? income : 1;
    
    const data = [
        { 
            name: 'Entradas', 
            value: 100, 
            realValue: income,
            percentage: 100,
            fill: 'url(#gradient-income)',
            stroke: '#22d3ee'
        },
        { 
            name: 'Saídas', 
            value: Math.min(90, Math.max(20, (expenses / safeIncome) * 100)), 
            realValue: expenses,
            percentage: ((expenses / safeIncome) * 100).toFixed(1),
            fill: 'url(#gradient-expense)',
            stroke: '#f87171'
        },
        { 
            name: 'Retenção', 
            value: Math.min(80, Math.max(10, (investments / safeIncome) * 100)), 
            realValue: investments,
            percentage: ((investments / safeIncome) * 100).toFixed(1),
            fill: 'url(#gradient-investment)',
            stroke: '#4ade80'
        }
    ];

    if (income === 0 && expenses === 0) return (
         <div className="card h-full flex flex-col items-center justify-center text-gray-500 border-dashed border-white/10 bg-transparent min-h-[300px]">
            <span className="text-xs font-medium">Sem dados de fluxo</span>
         </div>
    );

    return (
        <div className="card h-full flex flex-col min-h-[340px] bg-gradient-to-b from-gray-900/50 to-black/50 border border-white/5 rounded-2xl p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></span>
                    Eficiência Financeira
                </h3>
            </div>
            
            <div className="flex-grow relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                        <defs>
                            <linearGradient id="gradient-income" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#0891b2" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.9} />
                            </linearGradient>
                            <linearGradient id="gradient-expense" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#991b1b" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#f87171" stopOpacity={0.9} />
                            </linearGradient>
                            <linearGradient id="gradient-investment" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#166534" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#4ade80" stopOpacity={0.9} />
                            </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'white', opacity: 0.05 }} />
                        <Funnel 
                            dataKey="value" 
                            data={data} 
                            isAnimationActive 
                            lastShapeType="rectangle"
                        >
                            <LabelList 
                                position="right" 
                                fill="#e2e8f0" 
                                stroke="none" 
                                dataKey="name" 
                                fontSize={11} 
                                fontWeight={600}
                                content={(props: any) => {
                                    const { x, y, width, height, value, index } = props;
                                    const item = data[index];
                                    return (
                                        <g>
                                            <text x={x + 10} y={y + height / 2 - 8} fill="#94a3b8" fontSize={10} fontWeight={500}>{value}</text>
                                            <text x={x + 10} y={y + height / 2 + 8} fill="#f8fafc" fontSize={12} fontWeight={700}>{item.percentage}%</text>
                                        </g>
                                    );
                                }}
                            />
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.fill} 
                                    stroke={entry.stroke}
                                    strokeWidth={1}
                                    strokeOpacity={0.5}
                                />
                            ))}
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};