import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '../../../utils/formatters';
import { PrivacyMask } from '../PrivacyMask';

interface WealthFunnelChartProps {
    income: number;
    expenses: number;
    investments: number;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-black/95 border border-white/10 p-3 rounded-xl shadow-xl">
                <p className="font-bold text-white mb-1 text-xs uppercase tracking-wider">{data.name}</p>
                <PrivacyMask>
                    <p className="text-cyan-300 font-mono text-lg font-bold">{formatCurrency(data.realValue)}</p>
                </PrivacyMask>
                <p className="text-xs text-gray-400 mt-1">{data.value.toFixed(1)}% da Renda</p>
            </div>
        );
    }
    return null;
};

export const WealthFunnelChart: React.FC<WealthFunnelChartProps> = ({ income, expenses, investments }) => {
    const safeIncome = income > 0 ? income : 1;
    
    // Calculate percentages
    const expensesPct = Math.min(100, (expenses / safeIncome) * 100);
    const investmentsPct = Math.min(100, (investments / safeIncome) * 100);
    const retainedPct = Math.max(0, 100 - expensesPct); // Remaining

    const data = [
        {
            name: 'Entradas',
            value: 100,
            realValue: income,
            fill: '#22d3ee', // cyan-400
        },
        {
            name: 'Saídas',
            value: expensesPct,
            realValue: expenses,
            fill: '#f87171', // red-400
        },
        {
            name: 'Investimentos',
            value: investmentsPct,
            realValue: investments,
            fill: '#4ade80', // green-400
        }
    ];

    // Sort data so smaller rings don't get hidden if we were using a different layout,
    // but for RadialBarChart with separate rings, order matters for which ring is outer.
    // Usually first item is inner, last is outer? Or vice versa.
    // Let's keep Entradas (100%) as the outer ring (or background reference).
    // Actually, RadialBarChart renders in order.
    
    if (income === 0 && expenses === 0) return (
         <div className="card h-full flex flex-col items-center justify-center text-gray-500 border-dashed border-white/10 bg-transparent min-h-[300px]">
            <span className="text-xs font-medium">Sem dados de fluxo</span>
         </div>
    );

    return (
        <div className="card h-full flex flex-col min-h-[340px] bg-gradient-to-b from-gray-900/50 to-black/50 border border-white/5 rounded-2xl p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-2 relative z-10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></span>
                    Eficiência Financeira
                </h3>
            </div>
            
            <div className="flex-grow relative z-10 -ml-4 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                        innerRadius="30%" 
                        outerRadius="100%" 
                        barSize={15} 
                        data={data}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <RadialBar
                            background={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                            dataKey="value"
                            cornerRadius={10}
                        />
                        <Legend 
                            iconSize={8} 
                            layout="horizontal" 
                            verticalAlign="bottom" 
                            align="center"
                            wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingTop: '10px' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};