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
        return (
            <div className="bg-black/90 border border-cyan-500/30 backdrop-blur-xl p-3 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <p className="font-bold text-white mb-1">{payload[0].payload.name}</p>
                <p className="text-cyan-300 font-mono text-lg">
                    {formatCurrencyBRL(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

export const WealthFunnelChart: React.FC<WealthFunnelChartProps> = ({ income, expenses, investments }) => {
    const data = [
        { name: 'Renda Total', value: income || 0, fill: 'oklch(var(--primary-oklch))' },
        { name: 'Despesas', value: expenses || 0, fill: 'oklch(var(--danger-oklch))' },
        { name: 'Investimentos', value: investments || 0, fill: 'oklch(var(--success-oklch))' }
    ];

    // Evita renderizar gráfico vazio
    if (income === 0 && expenses === 0) return null;

    return (
        <div className="card h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
                Fluxo de Riqueza
            </h3>
            <div className="flex-grow min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Funnel dataKey="value" data={data} isAnimationActive>
                            <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.8} stroke="none" />
                            ))}
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};