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
    // Garante que não haja divisão por zero
    const safeIncome = income > 0 ? income : 1;

    // Prepara os dados:
    // 1. O valor visual (value) é normalizado para garantir o formato de funil (sempre decrescente ou proporcional).
    // 2. O valor real (realValue) é preservado para o tooltip.
    const data = [
        { 
            name: 'Renda Total', 
            value: 100, // Sempre 100% de largura visual
            realValue: income,
            percentage: 100,
            fill: 'oklch(var(--primary-oklch))' 
        },
        { 
            name: 'Despesas', 
            value: Math.min(90, Math.max(10, (expenses / safeIncome) * 100)), // Escala visual entre 10% e 90%
            realValue: expenses,
            percentage: ((expenses / safeIncome) * 100).toFixed(1),
            fill: 'oklch(var(--danger-oklch))' 
        },
        { 
            name: 'Investimentos', 
            value: Math.min(80, Math.max(5, (investments / safeIncome) * 100)), // Escala visual entre 5% e 80%
            realValue: investments,
            percentage: ((investments / safeIncome) * 100).toFixed(1),
            fill: 'oklch(var(--success-oklch))' 
        }
    ];

    // Ordena visualmente para garantir o formato de funil (V), mas mantém a lógica de cores
    // Na verdade, para um funil de fluxo, queremos a ordem: Renda -> Despesa -> Investimento
    // O Recharts desenha de cima para baixo.

    if (income === 0 && expenses === 0) return (
         <div className="card h-full flex flex-col items-center justify-center text-gray-500 border-dashed">
            <span className="text-sm">Sem dados suficientes</span>
         </div>
    );

    return (
        <div className="card h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
                Fluxo de Riqueza
            </h3>
            <div className="flex-grow min-h-[250px] -ml-4"> {/* Margem negativa para compensar padding do chart */}
                <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Funnel 
                            dataKey="value" 
                            data={data} 
                            isAnimationActive 
                            lastShapeType="rectangle"
                            neckWidth="10%" /* Afunila visualmente no final */
                            gap={2}
                        >
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