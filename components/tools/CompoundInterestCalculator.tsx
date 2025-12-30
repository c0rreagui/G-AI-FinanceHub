import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const CompoundInterestCalculator: React.FC = () => {
    const [principal, setPrincipal] = useState('1000');
    const [monthly, setMonthly] = useState('100');
    const [rate, setRate] = useState('10'); // Annual rate
    const [years, setYears] = useState('10');
    const isMobile = useMediaQuery('(max-width: 640px)');

    const data = useMemo(() => {
        const p = Number.parseFloat(principal) || 0;
        const m = Number.parseFloat(monthly) || 0;
        const r = (Number.parseFloat(rate) || 0) / 100;
        const t = Number.parseFloat(years) || 0;

        const monthlyRate = r / 12;
        const months = t * 12;

        const chartData = [];
        let currentAmount = p;
        let totalInvested = p;

        for (let i = 0; i <= months; i++) {
            if (i % 12 === 0) { // Record yearly points for cleaner chart
                chartData.push({
                    year: i / 12,
                    amount: currentAmount,
                    invested: totalInvested,
                    interest: currentAmount - totalInvested
                });
            }
            currentAmount = currentAmount * (1 + monthlyRate) + m;
            totalInvested += m;
        }

        return chartData;
    }, [principal, monthly, rate, years]);

    const finalAmount = data[data.length - 1]?.amount || 0;
    const totalInvested = data[data.length - 1]?.invested || 0;
    const totalInterest = finalAmount - totalInvested;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Calculadora de Juros Compostos
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Valor Inicial (R$)"
                        type="number"
                        value={principal}
                        onChange={e => setPrincipal(e.target.value)}
                    />
                    <Input
                        label="Aporte Mensal (R$)"
                        type="number"
                        value={monthly}
                        onChange={e => setMonthly(e.target.value)}
                    />
                    <Input
                        label="Taxa Anual (%)"
                        type="number"
                        value={rate}
                        onChange={e => setRate(e.target.value)}
                    />
                    <Input
                        label="Período (Anos)"
                        type="number"
                        value={years}
                        onChange={e => setYears(e.target.value)}
                    />
                </div>

                <div className={`grid gap-4 text-center bg-white/5 p-4 rounded-xl border border-white/5 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                    <div className="p-2 rounded-lg bg-black/20">
                        <p className="text-xs text-gray-400 mb-1">Total Investido</p>
                        <p className="font-bold text-white text-lg break-words" title={formatCurrency(totalInvested)}>
                            {formatCurrency(totalInvested)}
                        </p>
                    </div>
                    <div className="p-2 rounded-lg bg-black/20">
                        <p className="text-xs text-gray-400 mb-1">Total em Juros</p>
                        <p className="font-bold text-emerald-400 text-lg break-words" title={formatCurrency(totalInterest)}>
                            +{formatCurrency(totalInterest)}
                        </p>
                    </div>
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                        <p className="text-xs text-cyan-300 mb-1 font-medium">Montante Final</p>
                        <p className="font-bold text-cyan-400 text-xl break-words" title={formatCurrency(finalAmount)}>
                            {formatCurrency(finalAmount)}
                        </p>
                    </div>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="year" stroke="#666" fontSize={12} tickFormatter={(val) => `${val}a`} />
                            <YAxis stroke="#666" fontSize={12} tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                formatter={(value: number) => formatCurrency(value)}
                                labelFormatter={(label) => `Ano ${label}`}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#22d3ee" fillOpacity={1} fill="url(#colorAmount)" name="Total" />
                            <Area type="monotone" dataKey="invested" stroke="#666" fill="transparent" strokeDasharray="5 5" name="Investido" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
