import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Wallet } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatters';

export const BudgetSettings: React.FC = () => {
    const [budget, setBudget] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        const saved = localStorage.getItem('financehub_monthly_budget');
        if (saved) setBudget(saved);
    }, []);

    const handleSave = () => {
        if (!budget) {
            localStorage.removeItem('financehub_monthly_budget');
        } else {
            localStorage.setItem('financehub_monthly_budget', budget);
        }
        showToast('Orçamento Atualizado', { description: `Seu limite mensal é ${formatCurrency(Number(budget))}`, type: 'success' });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    Limite de Gastos Mensal
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Defina um teto para seus gastos mensais. Avisaremos se você tentar adicionar uma despesa que ultrapasse esse valor.
                </p>
                <div className="flex gap-4 items-end">
                    <div className="flex-grow">
                        <Input 
                            label="Valor Máximo (R$)" 
                            type="number" 
                            value={budget} 
                            onChange={e => setBudget(e.target.value)} 
                            placeholder="Ex: 2000.00"
                        />
                    </div>
                    <Button onClick={handleSave}>
                        Salvar Limite
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
