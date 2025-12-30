import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Brush } from 'recharts';
import { MonthlyChartData } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { motion } from 'framer-motion';
import { Progress } from '../Progress';
import { cn } from '../../../utils/utils';

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
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        Receita: <span className="font-mono font-bold text-white">{formatCurrency(payload[0].value)}</span>
                    </p>
                    <p className="text-rose-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]" />
                        Despesa: <span className="font-mono font-bold text-white">{formatCurrency(payload[1].value)}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export const MonthlySummaryChart: React.FC<MonthlySummaryChartProps> = ({ data }) => {
    const isMobile = !useMediaQuery('(min-width: 768px)');
    const hasData = data.some(d => d.receita > 0 || d.despesa > 0);
    const MotionDiv = motion.div as any;
    const [selectedPeriod, setSelectedPeriod] = React.useState('6M');

    const filteredData = React.useMemo(() => {
        if (!data || data.length === 0) return [];

        const now = new Date();
        const currentYear = now.getFullYear();

        switch (selectedPeriod) {
            case '3M':
                return data.slice(-3);
            case '6M':
                return data.slice(-6);
            case 'YTD':
                return data.filter(d => d.name.endsWith(currentYear.toString().slice(-2)));
            default:
                return data;
        }
    }, [data, selectedPeriod]);

    // Calculate Savings Rate based on filtered data (last month in view)
    const lastMonth = filteredData[filteredData.length - 1] || { receita: 0, despesa: 0 };
    const savings = lastMonth.receita - lastMonth.despesa;
    const savingsRate = lastMonth.receita > 0 ? (savings / lastMonth.receita) * 100 : 0;
    const isPositive = savings >= 0;
    const progressValue = isPositive ? savingsRate : Math.min((Math.abs(savings) / (lastMonth.despesa || 1)) * 100, 100);

    if (!hasData) {
        return (
            <div className="card h-full flex flex-col min-h-[300px] items-center justify-center text-muted-foreground">
                <div className="flex items-center justify-between mb-4 w-full px-4 absolute top-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full" />
                        Fluxo Financeiro
                    </h3>
                </div>
                <p className="text-sm">Sem movimentações nos últimos 6 meses.</p>
            </div>
        );
    }

    return (
        <div className="card h-full flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full" />
                    Fluxo Financeiro
                </h3>
                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-800/50 rounded-lg p-0.5 border border-slate-700/50">
                        {['3M', '6M', 'YTD'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={cn(
                                    "px-2 py-1 text-xs font-medium rounded-md transition-all",
                                    period === selectedPeriod
                                        ? "bg-cyan-500/20 text-cyan-400 shadow-sm"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                                )}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex flex-col">
                    <span className={cn("text-xs font-medium", isPositive ? "text-emerald-400" : "text-rose-400")}>
                        {isPositive ? "Taxa de Poupança" : "Déficit Mensal"}
                        <span className="text-slate-500 ml-1 font-normal">(Último Mês)</span>
                    </span>
                    <span className="text-2xl font-bold text-white tracking-tight">{Math.abs(savingsRate).toFixed(1)}%</span>
                </div>
            </div>

            <div className="mb-4">
                <Progress
                    value={Math.abs(progressValue)}
                    className="h-1.5 bg-white/5"
                    indicatorClassName={isPositive ? "bg-emerald-500" : "bg-rose-500"}
                />
            </div>

            <MotionDiv
                className="flex-grow w-full -ml-2 min-h-[250px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                        />
                        <YAxis
                            tickFormatter={(value) => `R$${Number(value) / 1000}k`}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            width={35}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ paddingBottom: '15px', fontSize: '12px', fontWeight: 600, opacity: 0.8 }}
                        />
                        <Brush
                            dataKey="name"
                            height={30}
                            stroke="#8884d8"
                            fill="rgba(30, 41, 59, 0.5)"
                            tickFormatter={() => ''}
                            travellerWidth={10}
                        />
                        <Area
                            type="monotone"
                            dataKey="receita"
                            name="Receitas"
                            stroke="#34d399"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorReceita)"
                            activeDot={{ r: 6, fill: '#34d399', stroke: '#fff', strokeWidth: 2, className: "animate-ping" }}
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="despesa"
                            name="Despesas"
                            stroke="#fb7185"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorDespesa)"
                            activeDot={{ r: 6, fill: '#fb7185', stroke: '#fff', strokeWidth: 2 }}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </MotionDiv>
        </div>
    );
};