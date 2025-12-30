import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SmartInput } from '../ui/SmartInput';
import { SmartDatePicker } from '../ui/SmartDatePicker';
import { TickerSearch } from '../ui/TickerSearch';
import { useDashboardData } from '../../hooks/useDashboardData';
import { TransactionType, TransactionStatus } from '../../types';
import { LoadingSpinner } from '../LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { triggerHapticFeedback } from '../../utils/haptics';
import { triggerConfetti } from '../ui/Confetti';

interface AddInvestmentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddInvestmentDrawer: React.FC<AddInvestmentDrawerProps> = ({ isOpen, onClose }) => {
    const { addTransaction, categories, accounts } = useDashboardData();
    const { showToast } = useToast();
    
    const [ticker, setTicker] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate total automatically
    const total = (parseFloat(quantity || '0') * parseFloat(price || '0')).toFixed(2);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate account exists
        if (!accounts || accounts.length === 0) {
            showToast('Erro: Nenhuma conta disponível. Crie uma conta primeiro.', { type: 'error' });
            return;
        }
        
        const numericTotal = parseFloat(total);
        if (Number.isNaN(numericTotal) || numericTotal <= 0) {
            showToast('Valor inválido. Verifique quantidade e preço.', { type: 'error' });
            return;
        }
        
        setIsSubmitting(true);

        try {
            // Find or create 'Investimentos' category
            const investCat = categories.find(c => c.name.toLowerCase().includes('investimento')) || categories[0];

            await addTransaction({
                description: `Compra: ${ticker.toUpperCase()} (${quantity}x)`,
                amount: -Math.abs(numericTotal),
                date: new Date(date).toISOString(),
                type: TransactionType.DESPESA, // Investments are technically outflows initially
                categoryId: investCat.id,
                account_id: accounts[0].id,
                status: TransactionStatus.COMPLETED,
                created_at: new Date().toISOString(),
                goal_contribution_id: null,
                debt_payment_id: null,
                investment_id: null
            });
            
            showToast('Investimento registrado!', { type: 'success' });
            triggerHapticFeedback(50);
            triggerConfetti();
            onClose();
            setTicker('');
            setQuantity('');
            setPrice('');
        } catch (error) {
            console.error(error);
            showToast('Erro ao salvar investimento', { type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Novo Aporte" 
            themeColor="violet"
            footer={
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/5">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || !ticker || !quantity || !price}
                        className="bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-lg shadow-violet-500/20"
                    >
                        {isSubmitting ? <LoadingSpinner /> : 'Confirmar Aporte'}
                    </Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-violet-400/80">Ativo (Ticker)</label>
                    <TickerSearch
                        value={ticker}
                        onChange={setTicker}
                        onSelect={(asset) => {
                            setTicker(asset.ticker);
                            // Optional: auto-fill price if we had real data
                            // setPrice('100.00'); 
                        }}
                        placeholder="Ex: PETR4, BTC, AAPL..."
                        autoFocus
                        className="w-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Quantidade</label>
                        <Input
                            type="number"
                            inputMode="decimal"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="0"
                            className="bg-slate-900/50 border-white/10 focus:border-violet-500/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Preço Unitário</label>
                        <SmartInput
                            value={price}
                            onChange={setPrice}
                            placeholder="0,00"
                            className="text-violet-500"
                        />
                    </div>
                </div>

                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 flex justify-between items-center">
                    <span className="text-violet-300">Total Estimado</span>
                    <span className="text-2xl font-bold text-violet-400">R$ {total}</span>
                </div>

                <div className="space-y-2">
                    <SmartDatePicker
                        label="Data"
                        value={date}
                        onChange={setDate}
                    />
                </div>
            </form>
        </Drawer>
    );
};
