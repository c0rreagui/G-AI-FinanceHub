import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calculator, RefreshCw } from 'lucide-react';

export const CompoundInterestCalculator: React.FC = () => {
  const [initialAmount, setInitialAmount] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [interestRate, setInterestRate] = useState(10); // Annual
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    const result = [];
    let currentBalance = initialAmount;
    let totalInvested = initialAmount;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = years * 12;

    for (let i = 0; i <= totalMonths; i++) {
      if (i % 12 === 0) { // Record yearly data points for cleaner chart
        result.push({
          year: i / 12,
          invested: Math.round(totalInvested),
          interest: Math.round(currentBalance - totalInvested),
          total: Math.round(currentBalance),
        });
      }

      // Calculate next month
      currentBalance = currentBalance * (1 + monthlyRate) + monthlyContribution;
      totalInvested += monthlyContribution;
    }
    return result;
  }, [initialAmount, monthlyContribution, interestRate, years]);

  const finalBalance = data[data.length - 1].total;
  const totalInvestedFinal = data[data.length - 1].invested;
  const totalInterestFinal = data[data.length - 1].interest;

  return (
    <Card className="border-white/5 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Calculator className="w-5 h-5 text-primary" />
          Calculadora de Juros Compostos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Aporte Inicial (R$)</Label>
              <Input 
                type="number" 
                value={initialAmount} 
                onChange={(e) => setInitialAmount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Aporte Mensal (R$)</Label>
              <Input 
                type="number" 
                value={monthlyContribution} 
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Taxa de Juros Anual (%)</Label>
              <Input 
                type="number" 
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Período (Anos)</Label>
              <Input 
                type="number" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Results & Chart */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-sm text-gray-400">Total Investido</p>
                <p className="text-xl font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvestedFinal)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-sm text-gray-400">Total em Juros</p>
                <p className="text-xl font-bold text-emerald-400">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInterestFinal)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-sm text-primary">Montante Final</p>
                <p className="text-xl font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalBalance)}
                </p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#6b7280" />
                  <YAxis 
                    stroke="#6b7280" 
                    tickFormatter={(value) => `R$ ${value / 1000}k`}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                    formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    name="Montante Total"
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="invested" 
                    name="Total Investido"
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorInvested)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
