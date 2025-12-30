import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { formatCurrency } from '../../utils/formatters';
import { Scale } from 'lucide-react';

export const RateComparator: React.FC = () => {
    const [cdbRate, setCdbRate] = useState('100'); // % do CDI
    const [lciRate, setLciRate] = useState('90'); // % do CDI
    const [cdi, setCdi] = useState('11.25'); // CDI atual
    const [days, setDays] = useState('365');

    const calculateNetReturn = (ratePercent: number, isTaxFree: boolean) => {
        const grossRate = (ratePercent / 100) * (parseFloat(cdi) / 100);
        
        let taxRate = 0;
        if (!isTaxFree) {
            const d = parseFloat(days);
            if (d <= 180) taxRate = 0.225;
            else if (d <= 360) taxRate = 0.20;
            else if (d <= 720) taxRate = 0.175;
            else taxRate = 0.15;
        }

        const netRate = grossRate * (1 - taxRate);
        return netRate * 100;
    };

    const cdbNet = calculateNetReturn(parseFloat(cdbRate), false);
    const lciNet = calculateNetReturn(parseFloat(lciRate), true);

    const winner = cdbNet > lciNet ? 'CDB' : 'LCI/LCA';
    const difference = Math.abs(cdbNet - lciNet);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-400" />
                    Comparador de Taxas (CDB vs LCI/LCA)
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="Taxa CDB (% CDI)" 
                        type="number" 
                        value={cdbRate} 
                        onChange={e => setCdbRate(e.target.value)} 
                    />
                    <Input 
                        label="Taxa LCI/LCA (% CDI)" 
                        type="number" 
                        value={lciRate} 
                        onChange={e => setLciRate(e.target.value)} 
                    />
                    <Input 
                        label="CDI Atual (% a.a.)" 
                        type="number" 
                        value={cdi} 
                        onChange={e => setCdi(e.target.value)} 
                    />
                    <Input 
                        label="Prazo (Dias)" 
                        type="number" 
                        value={days} 
                        onChange={e => setDays(e.target.value)} 
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg border ${winner === 'CDB' ? 'bg-green-500/10 border-green-500/50' : 'bg-white/5 border-white/10'}`}>
                        <h4 className="font-bold mb-2">CDB (Tributado)</h4>
                        <p className="text-sm text-gray-400">Retorno Líquido Estimado</p>
                        <p className="text-2xl font-bold">{cdbNet.toFixed(2)}% a.a.</p>
                    </div>
                    <div className={`p-4 rounded-lg border ${winner === 'LCI/LCA' ? 'bg-green-500/10 border-green-500/50' : 'bg-white/5 border-white/10'}`}>
                        <h4 className="font-bold mb-2">LCI/LCA (Isento)</h4>
                        <p className="text-sm text-gray-400">Retorno Líquido Estimado</p>
                        <p className="text-2xl font-bold">{lciNet.toFixed(2)}% a.a.</p>
                    </div>
                </div>

                <div className="bg-blue-500/10 p-4 rounded-lg text-center">
                    <p className="text-blue-200">
                        A melhor opção é <strong>{winner}</strong>, rendendo <strong>{difference.toFixed(2)}%</strong> a mais ao ano.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
