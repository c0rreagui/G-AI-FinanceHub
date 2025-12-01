import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SmartInput } from '../ui/SmartInput';
import { SmartDatePicker } from '../ui/SmartDatePicker';
import { CategoryPicker } from '../ui/CategoryPicker';
import { useDashboardData } from '../../hooks/useDashboardData';
import { TransactionType } from '../../types';
import { LoadingSpinner } from '../LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { triggerHapticFeedback } from '../../utils/haptics';

interface AddExpenseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddExpenseDrawer: React.FC<AddExpenseDrawerProps> = ({ isOpen, onClose }) => {
    const { addTransaction, categories } = useDashboardData();
    const { showToast } = useToast();
    
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categoryId, setCategoryId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addTransaction({
                description,
                amount: parseFloat(amount),
                date: new Date(date).toISOString(),
                type: TransactionType.DESPESA,
                categoryId
            });
            
            showToast('Despesa registrada!', { type: 'success' });
            triggerHapticFeedback(30);
            onClose();
            // Reset form
            setDescription('');
            setAmount('');
            setCategoryId('');
        } catch (error) {
            console.error(error);
            showToast('Erro ao salvar despesa', { type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Nova Despesa" 
            themeColor="red"
            footer={
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white hover:bg-white/5">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || !description || !amount || !categoryId}
                        className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/20"
                    >
                        {isSubmitting ? <LoadingSpinner /> : 'Confirmar Despesa'}
                    </Button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-red-400/80">Valor da Despesa</label>
                    <SmartInput
                        value={amount}
                        onChange={setAmount}
                        placeholder="0,00"
                        autoFocus
                        className="text-red-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Descrição</label>
                    <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Jantar, Uber, Mercado..."
                        className="bg-slate-900/50 border-white/10 focus:border-red-500/50"
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
