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
import { ScannerOverlay } from '../ui/ScannerOverlay';
import { MicrophoneButton } from '../ui/MicrophoneButton';
import { VirtualKeyboard } from '../ui/VirtualKeyboard';
import { Scan } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface AddExpenseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddExpenseDrawer: React.FC<AddExpenseDrawerProps> = ({ isOpen, onClose }) => {
    const { addTransaction, categories, accounts } = useDashboardData();
    const { showToast } = useToast();
    
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]);
    const [categoryId, setCategoryId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    // Mock scanner function
    const handleScan = (text: string) => {
        // Logic to parse receipt text (e.g. "Starbucks R$ 25.00")
        // For now just simulation
        if (text.includes('R$')) {
             const amountMatch = text.match(/R\$\s?([\d,.]+)/);
             if (amountMatch) setAmount(amountMatch[1]);
        }
        setShowScanner(false);
        showToast('Recibo processado!', { type: 'success' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate account exists
        if (!accounts || accounts.length === 0) {
            showToast('Erro: Nenhuma conta disponível. Crie uma conta primeiro.', { type: 'error' });
            return;
        }
        
        const numericAmount = Number.parseFloat(amount);
        if (Number.isNaN(numericAmount) || numericAmount <= 0) {
            showToast('Valor inválido. Insira um valor maior que zero.', { type: 'error' });
            return;
        }
        
        setIsSubmitting(true);

        try {
            await addTransaction({
                description,
                amount: -Math.abs(numericAmount),
                date: new Date(date).toISOString(),
                type: TransactionType.DESPESA,
                categoryId,
                status: TransactionStatus.COMPLETED,
                account_id: accounts[0].id,
                created_at: new Date().toISOString(),
                goal_contribution_id: null,
                debt_payment_id: null,
                investment_id: null
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
                <div className="absolute top-4 right-16 z-50">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowScanner(true)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Escanear Recibo"
                    >
                        <Scan className="w-5 h-5" />
                    </Button>
                </div>

                <ScannerOverlay 
                    isOpen={showScanner} 
                    onClose={() => setShowScanner(false)} 
                    onCapture={handleScan} 
                />

                <div className="space-y-2 relative">
                    <label className="text-sm font-medium text-red-400/80">Valor da Despesa</label>
                    <div className="flex items-center gap-2">
                        <SmartInput
                            value={amount}
                            onChange={setAmount}
                            placeholder="0,00"
                            autoFocus
                            className="text-red-500"
                            readOnly={isMobile} // Disable native keyboard on mobile if using VirtualKeyboard
                        />
                    </div>
                </div>

                {isMobile && !categoryId && (
                     <div className="pb-4">
                        <VirtualKeyboard 
                            onPress={(key) => {
                                if (key === 'backspace') setAmount(prev => prev.slice(0, -1));
                                else if (key === 'done') { /* Close keyboard or focus next? */ }
                                else setAmount(prev => prev + key);
                            }} 
                            onDelete={() => setAmount(prev => prev.slice(0, -1))}
                            confirmText="Próximo"
                            onConfirm={() => {}} 
                        />
                     </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Descrição</label>
                    <div className="flex gap-2">
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Jantar, Uber, Mercado..."
                            className="bg-slate-900/50 border-white/10 focus:border-red-500/50 flex-1"
                        />
                         <MicrophoneButton 
                            onRecordingStop={(text) => setDescription(text)} 
                            className="bg-red-500 text-white"
                            size="md"
                        />
                    </div>
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
