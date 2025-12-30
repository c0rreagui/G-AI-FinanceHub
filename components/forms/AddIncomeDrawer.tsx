import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SmartInput } from '../ui/SmartInput';
import { SmartDatePicker } from '../ui/SmartDatePicker';
import { CategoryPicker } from '../ui/CategoryPicker';
import { useDashboardData } from '../../hooks/useDashboardData';
import { TransactionType, TransactionStatus } from '../../types';
import { LoadingSpinner } from '../LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { triggerHapticFeedback } from '../../utils/haptics';
import { triggerConfetti } from '../ui/Confetti';

interface AddIncomeDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddIncomeDrawer: React.FC<AddIncomeDrawerProps> = ({ isOpen, onClose }) => {
    const { addTransaction, categories, accounts } = useDashboardData();
    const { showToast } = useToast();
    
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]);
    const [categoryId, setCategoryId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate account exists
        if (!accounts || accounts.length === 0) {
            showToast('Erro: Nenhuma conta disponível. Crie uma conta primeiro.', { type: 'error' });
            return;
        }
        
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            showToast('Valor inválido. Insira um valor maior que zero.', { type: 'error' });
            return;
        }
        
        setIsSubmitting(true);

        try {
            await addTransaction({
                description,
                amount: Math.abs(numericAmount),
                date: new Date(date).toISOString(),
                type: TransactionType.RECEITA,
                categoryId,
                account_id: accounts[0].id,
                status: TransactionStatus.COMPLETED,
                created_at: new Date().toISOString(),
                goal_contribution_id: null,
                debt_payment_id: null,
                investment_id: null
            });
            
            showToast('Receita registrada!', { type: 'success' });
            triggerHapticFeedback(50);
            triggerConfetti();
            onClose();
            setDescription('');
            setAmount('');
            setCategoryId('');
        } catch (error) {
            console.error(error);
            showToast('Erro ao salvar receita', { type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Nova Receita" 
            themeColor="green"
            footer={
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/5">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || !description || !amount || !categoryId}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/20"
                    >
                        {isSubmitting ? <LoadingSpinner /> : 'Confirmar Receita'}
                    </Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-emerald-400/80">Valor da Receita</label>
                    <SmartInput
                        value={amount}
                        onChange={setAmount}
                        placeholder="0,00"
                        autoFocus
                        className="text-emerald-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Descrição / Fonte</label>
                    <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Salário, Freela, Venda..."
                        className="bg-slate-900/50 border-white/10 focus:border-emerald-500/50"
                    />
                </div>

                <div className="space-y-2">
                     <SmartDatePicker
                        label="Data"
                        value={date}
                        onChange={setDate}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Categoria</label>
                    <div className="bg-slate-900/50 border border-white/10 rounded-xl p-4 max-h-60 overflow-y-auto custom-scrollbar">
                        <CategoryPicker 
                            categories={categories}
                            selectedCategoryId={categoryId}
                            onSelectCategory={setCategoryId}
                        />
                    </div>
                </div>
            </form>
        </Drawer>
    );
};
