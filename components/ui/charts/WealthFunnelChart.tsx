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
            <div className="bg-black/90 border border-cyan-500/30 backdrop-blur-xl p-3 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)]">
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
    // Garante que não haja divisão por zero e define a renda como base
    const safeIncome = income > 0 ? income : 1;

    // Lógica de Normalização Visual:
    // 1. Renda é sempre 100 (topo do funil).
    // 2. Despesas e Investimentos são proporcionais à renda.
    // 3. Math.max(5, ...) garante que mesmo valores pequenos tenham uma barra mínima visível (5%).
    // 4. Math.min(100, ...) garante que a barra não ultrapasse 100% visualmente (mesmo que a dívida seja maior que a renda).

    const data = [
        { 
            name: 'Renda Total', 
            value: 100, 
            realValue: income,
            percentage: 100,
            fill: 'oklch(var(--primary-oklch))' 
        },
        { 
            name: 'Despesas', 
            value: Math.min(100, Math.max(5, (expenses / safeIncome) * 100)),
            realValue: expenses,
            percentage: ((expenses / safeIncome) * 100).toFixed(1),
            fill: 'oklch(var(--danger-oklch))' 
        },
        { 
            name: 'Investimentos', 
            value: Math.min(100, Math.max(5, (investments / safeIncome) * 100)),
            realValue: investments,
            percentage: ((investments / safeIncome) * 100).toFixed(1),
            fill: 'oklch(var(--success-oklch))' 
        }
    ];

    // Se não houver dados relevantes, mostra estado vazio
    if (income === 0 && expenses === 0) return (
         <div className="card h-full flex flex-col items-center justify-center text-gray-500 border border-dashed border-gray-700 bg-transparent">
            <span className="text-sm">Sem dados suficientes</span>
         </div>
    );

    return (
        <div className="card h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
                Fluxo de Riqueza
            </h3>
            <div className="flex-grow min-h-[250px] -ml-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Funnel 
                            dataKey="value" 
                            data={data} 
                            isAnimationActive 
                            lastShapeType="rectangle"
                        >
                            <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
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