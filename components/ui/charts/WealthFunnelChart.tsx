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
    
    // Visualmente o gráfico deve ser um funil perfeito.
    // Value controla a largura da barra (visual). RealValue é o dado real.
    const data = [
        { 
            name: 'Entradas', 
            value: 100, 
            realValue: income,
            percentage: 100,
            fill: 'oklch(var(--primary-oklch))' 
        },
        { 
            name: 'Saídas', 
            value: Math.min(90, Math.max(20, (expenses / safeIncome) * 100)), 
            realValue: expenses,
            percentage: ((expenses / safeIncome) * 100).toFixed(1),
            fill: 'oklch(var(--danger-oklch))' 
        },
        { 
            name: 'Retenção', 
            value: Math.min(80, Math.max(10, (investments / safeIncome) * 100)), 
            realValue: investments,
            percentage: ((investments / safeIncome) * 100).toFixed(1),
            fill: 'oklch(var(--success-oklch))' 
        }
    ];

    if (income === 0 && expenses === 0) return (
         <div className="card h-full flex flex-col items-center justify-center text-gray-500 border-dashed border-white/10 bg-transparent">
            <span className="text-xs font-medium">Sem dados de fluxo</span>
         </div>
    );

    return (
        <div className="card h-full flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></span>
                    Eficiência
                </h3>
            </div>
            <div className="flex-grow -ml-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Funnel 
                            dataKey="value" 
                            data={data} 
                            isAnimationActive 
                            lastShapeType="rectangle"
                            gap={4}
                        >
                            <LabelList position="right" fill="#94a3b8" stroke="none" dataKey="name" fontSize={10} fontWeight={600} />
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.9} stroke="none" />
                            ))}
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};