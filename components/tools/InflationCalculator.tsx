import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { formatCurrency } from '../../utils/formatters';
import { TrendingDown } from 'lucide-react';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const InflationCalculator: React.FC = () => {
    const [amount, setAmount] = useState('1000');
    const [inflationRate, setInflationRate] = useState('4.5'); // IPCA anual médio
    const [years, setYears] = useState('10');

    const result = useMemo(() => {
        const val = parseFloat(amount) || 0;
        const rate = (parseFloat(inflationRate) || 0) / 100;
        const time = parseFloat(years) || 0;

        if (val <= 0 || time <= 0) return null;

        // Future Value required to maintain purchasing power
        const futureRequired = val * Math.pow(1 + rate, time);
        
        // Purchasing Power of current amount in future
        const futurePower = val / Math.pow(1 + rate, time);

        const data = [];
        for (let i = 0; i <= time; i++) {
            data.push({
                year: i,
                power: val / Math.pow(1 + rate, i),
                required: val * Math.pow(1 + rate, i)
            });
        }

        return {
            futureRequired,
            futurePower,
            loss: val - futurePower,
            data
        };
    }, [amount, inflationRate, years]);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                    Calculadora de Inflação
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="Valor Hoje (R$)" 
                        type="number" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                    />
                    <Input 
                        label="Inflação Média (% a.a.)" 
                        type="number" 
                        value={inflationRate} 
                        onChange={e => setInflationRate(e.target.value)} 
                    />
                    <Input 
                        label="Período (Anos)" 
                        type="number" 
                        value={years} 
                        onChange={e => setYears(e.target.value)} 
                        className="col-span-2"
                    />
                </div>

                {result && (
                    <>
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-sm text-red-200 mb-2">
                                Para comprar o que você compra hoje com <strong>{formatCurrency(parseFloat(amount))}</strong>, daqui a <strong>{years} anos</strong> você precisará de:
                            </p>
                            <p className="text-3xl font-bold text-red-500">
                                {formatCurrency(result.futureRequired)}
                            </p>
                        </div>
                        
                        <div className="h-48 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={result.data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="year" stroke="#666" fontSize={12} tickFormatter={(val) => `${val}a`} />
                                    <YAxis stroke="#666" fontSize={12} tickFormatter={(val) => `R$${val}`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                        formatter={(value: number) => formatCurrency(value)}
                                        labelFormatter={(label) => `Ano ${label}`}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="power" 
                                        stroke="#f87171" 
                                        strokeWidth={2}
                                        name="Poder de Compra Real" 
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};
