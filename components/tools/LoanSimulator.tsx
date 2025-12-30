import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Calculator } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type AmortizationSystem = 'SAC' | 'PRICE';

export const LoanSimulator: React.FC = () => {
    const [loanAmount, setLoanAmount] = useState('200000');
    const [annualRate, setAnnualRate] = useState('10.5');
    const [years, setYears] = useState('30');
    const [system, setSystem] = useState<AmortizationSystem>('SAC');

    const simulation = useMemo(() => {
        const principal = parseFloat(loanAmount) || 0;
        const rAnnual = parseFloat(annualRate) || 0;
        const totalMonths = (parseFloat(years) || 0) * 12;
        
        if (principal <= 0 || rAnnual <= 0 || totalMonths <= 0) return null;

        const rMonthly = Math.pow(1 + rAnnual / 100, 1 / 12) - 1;
        
        const data = [];
        let currentBalance = principal;
        let totalInterest = 0;
        let totalPaid = 0;

        // PRICE: Constant PMI (Payment)
        const pricePmt = principal * (rMonthly * Math.pow(1 + rMonthly, totalMonths)) / (Math.pow(1 + rMonthly, totalMonths) - 1);

        // SAC: Constant Amortization
        const sacAmortization = principal / totalMonths;

        for (let i = 1; i <= totalMonths; i++) {
            let interest = currentBalance * rMonthly;
            let amortization = 0;
            let payment = 0;

            if (system === 'SAC') {
                amortization = sacAmortization;
                payment = amortization + interest;
            } else { // PRICE
                payment = pricePmt;
                amortization = payment - interest;
            }

            // Correction for last installment rounding
            if (currentBalance < amortization) {
                amortization = currentBalance;
                payment = amortization + interest;
            }

            currentBalance -= amortization;
            totalInterest += interest;
            totalPaid += payment;

            // Store yearly data points for chart readability
            if (i % 12 === 0 || i === 1 || i === totalMonths) {
                data.push({
                    month: i,
                    year: (i / 12).toFixed(1),
                    balance: Math.max(0, currentBalance),
                    paid: totalPaid,
                    interestPaid: totalInterest,
                    amortized: totalPaid - totalInterest
                });
            }
        }

        return {
            data,
            totalInterest,
            totalPaid,
            firstInstallment: system === 'SAC' ? (sacAmortization + principal * rMonthly) : pricePmt,
            lastInstallment: system === 'SAC' ? (sacAmortization + (sacAmortization * rMonthly)) : pricePmt // Approx for SAC
        };

    }, [loanAmount, annualRate, years, system]);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-orange-400" />
                    Simulador de Financiamento
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-2 mb-4 bg-secondary/50 p-1 rounded-lg">
                    <Button 
                        variant={system === 'SAC' ? 'default' : 'ghost'} 
                        onClick={() => setSystem('SAC')}
                        className="flex-1"
                    >
                        SAC (Decrescente)
                    </Button>
                    <Button 
                        variant={system === 'PRICE' ? 'default' : 'ghost'} 
                        onClick={() => setSystem('PRICE')}
                        className="flex-1"
                    >
                        Price (Fixa)
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="Valor do Imóvel/Veículo" 
                        type="number" 
                        value={loanAmount} 
                        onChange={e => setLoanAmount(e.target.value)} 
                    />
                    <Input 
                        label="Taxa de Juros (% a.a.)" 
                        type="number" 
                        value={annualRate} 
                        onChange={e => setAnnualRate(e.target.value)} 
                    />
                    <Input 
                        label="Prazo (Anos)" 
                        type="number" 
                        value={years} 
                        onChange={e => setYears(e.target.value)} 
                        className="col-span-2"
                    />
                </div>

                {simulation && (
                    <>
                        <div className="grid grid-cols-2 gap-2 text-center bg-white/5 p-4 rounded-lg">
                            <div>
                                <p className="text-xs text-gray-400">Primeira Parcela</p>
                                <p className="font-bold text-white">{formatCurrency(simulation.firstInstallment)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Total de Juros</p>
                                <p className="font-bold text-orange-400">{formatCurrency(simulation.totalInterest)}</p>
                            </div>
                            <div className="col-span-2 mt-2 pt-2 border-t border-white/10">
                                <p className="text-xs text-gray-400">Total Pago</p>
                                <p className="text-lg font-bold text-cyan-400">{formatCurrency(simulation.totalPaid)}</p>
                            </div>
                        </div>

                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={simulation.data}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="year" stroke="#666" fontSize={12} tickFormatter={(val) => `${val}a`} />
                                    <YAxis stroke="#666" fontSize={12} tickFormatter={(val) => `R$${(val/1000).toFixed(0)}k`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                        formatter={(value: number) => formatCurrency(value)}
                                        labelFormatter={(label) => `Ano ${label}`}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="balance" 
                                        stroke="#f97316" 
                                        fillOpacity={1} 
                                        fill="url(#colorBalance)" 
                                        name="Saldo Devedor" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};
