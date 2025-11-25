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
            <div className="bg-black/90 border border-cyan-500/30 backdrop-blur-xl p-3 rounded-xl shadow-lg">
                <p className="font-bold text-white mb-1">{data.name}</p>
                <p className="text-cyan-300 font-mono text-lg">
                    {formatCurrencyBRL(data.realValue)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    {data.percentage}% da Renda
                </p>
            </div>
        );
    }
    return null;
};

export const WealthFunnelChart: React.FC<WealthFunnelChartProps> = ({ income, expenses, investments }) => {
    const safeIncome = income > 0 ? income : 1;

    // Lógica: Visualmente normalizado (Renda = 100), Valor Real preservado.
    const data = [
        { 
            name: 'Renda', 
            value: 100, 
            realValue: income,
            percentage: 100,
            fill: 'oklch(var(--primary-oklch))' 
        },
        { 
            name: 'Despesas', 
            value: Math.min(95, Math.max(10, (expenses / safeIncome) * 100)), // Normaliza visual entre 10% e 95%
            realValue: expenses,
            percentage: ((expenses / safeIncome) * 100).toFixed(1),
            fill: 'oklch(var(--danger-oklch))' 
        },
        { 
            name: 'Sobra/Inv.', 
            value: Math.min(80, Math.max(5, (investments / safeIncome) * 100)), // Normaliza visual entre 5% e 80%
            realValue: investments,
            percentage: ((investments / safeIncome) * 100).toFixed(1),
            fill: 'oklch(var(--success-oklch))' 
        }
    ];

    if (income === 0 && expenses === 0) return (
         <div className="card h-full flex items-center justify-center text-slate-500 border-dashed bg-transparent">
            <span className="text-xs">Sem dados de fluxo</span>
         </div>
    );

    return (
        <div className="card h-full flex flex-col min-h-[280px]">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1 h-5 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></span>
                Eficiência
            </h3>
            <div className="flex-grow -ml-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Funnel 
                            dataKey="value" 
                            data={data} 
                            isAnimationActive 
                            lastShapeType="rectangle"
                            gap={2}
                        >
                            <LabelList position="right" fill="#cbd5e1" stroke="none" dataKey="name" fontSize={11} />
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.85} stroke="none" />
                            ))}
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};