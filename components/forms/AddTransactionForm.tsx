import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, TransactionType } from '../../types';
import { Input } from '../ui/Input';
import { TypeToggle } from '../ui/TypeToggle';
import { CategoryPicker } from '../ui/CategoryPicker';
import { LoadingSpinner } from '../LoadingSpinner';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '../Icons';
import { triggerHapticFeedback } from '../../utils/haptics';

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: Partial<Omit<Transaction, 'id' | 'category'>>;
  transactionToEdit?: Transaction;
}

const QuickValueChip: React.FC<{ value: number; onSelect: (value: number) => void }> = ({ value, onSelect }) => (
    <button
        type="button"
        onClick={() => {
          triggerHapticFeedback();
          onSelect(value);
        }}
        className="px-3 py-1.5 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
        aria-label={`Selecionar valor rápido de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}`}
    >
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
    </button>
);

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ isOpen, onClose, prefill, transactionToEdit }) => {
  const { addTransaction, updateTransaction, categories } = useDashboardData();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.DESPESA);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = !!transactionToEdit;
  const quickValues = [5, 10, 20, 50, 100];

  useEffect(() => {
    const dataToSet = transactionToEdit || prefill;
    if (dataToSet && isOpen) {
        setDescription(dataToSet.description || '');
        setAmount(dataToSet.amount ? String(Math.abs(dataToSet.amount)) : '');
        
        const sanitizedType = dataToSet.type === TransactionType.RECEITA 
            ? TransactionType.RECEITA 
            : TransactionType.DESPESA;
        setType(sanitizedType);
        
        // FIX: Corrected field name to snake_case to match database schema.
        setCategoryId(dataToSet.category_id || null);
        setDate(dataToSet.date ? dataToSet.date.split('T')[0] : new Date().toISOString().split('T')[0]);
    }
  }, [prefill, transactionToEdit, isOpen]);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType(TransactionType.DESPESA);
    setCategoryId(null);
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description || !amount || !categoryId || isNaN(numericAmount) || isSubmitting) return;

    setIsSubmitting(true);
    const finalAmount = type === TransactionType.DESPESA ? -Math.abs(numericAmount) : Math.abs(numericAmount);

    let success = false;
    if (isEditing) {
        // FIX: Use snake_case for database fields.
        const txData = {
            id: transactionToEdit.id,
            description,
            amount: finalAmount,
            type,
            categoryId,
            date: new Date(date).toISOString(),
            goal_contribution_id: transactionToEdit.goal_contribution_id,
            debt_payment_id: transactionToEdit.debt_payment_id,
        };
        success = await updateTransaction(txData);

    } else {
        // FIX: Use snake_case for database fields.
        const txData = {
            description,
            amount: finalAmount,
            type,
            categoryId,
            date: new Date(date).toISOString(),
        };
        success = await addTransaction(txData);
    }
    
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };
  
  const FormFields = (
    <>
        <TypeToggle selectedType={type} onTypeChange={setType} />
        <Input
          id="tx-description"
          label="Descrição"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-4">
            <Input
              id="tx-amount"
              label="Valor (R$)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50.00"
              step="0.01"
              required
            />
            <Input
              id="tx-date"
              label="Data"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Valores Rápidos
            </label>
            <div className="flex items-center gap-2 flex-wrap">
                {quickValues.map(val => (
                    <QuickValueChip key={val} value={val} onSelect={(v) => setAmount(String(v))} />
                ))}
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300">
                Categoria
            </label>
            <CategoryPicker 
                categories={categories}
                selectedCategoryId={categoryId}
                onSelectCategory={setCategoryId}
            />
        </div>
    </>
  );

  if (isDesktop) {
      return (
          <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Transação" : "Nova Transação"}>
              <form onSubmit={handleSubmit} className="space-y-4">
                  {FormFields}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !categoryId}>
                      {isSubmitting ? <><LoadingSpinner /> Salvando...</> : (isEditing ? 'Salvar Alterações' : 'Salvar Transação')}
                    </Button>
                  </div>
              </form>
          </Modal>
      )
  }

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                className="fixed inset-0 z-50 flex flex-col bg-[oklch(var(--card-oklch))]"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                onAnimationComplete={() => { if (!isOpen) resetForm(); }}
            >
                {/* Header Fixo */}
                <div className="flex items-center justify-between p-4 border-b border-[oklch(var(--border-oklch))] flex-shrink-0">
                    <h2 className="text-xl font-semibold text-white">{isEditing ? "Editar Transação" : "Nova Transação"}</h2>
                    <button onClick={onClose} className="p-1 text-gray-400"><XIcon className="w-6 h-6" /></button>
                </div>
                
                {/* Conteúdo Rolável */}
                <div className="flex-grow p-4 overflow-y-auto">
                    <form id="mobile-tx-form" onSubmit={handleSubmit} className="space-y-6">
                        {FormFields}
                    </form>
                </div>

                {/* Rodapé Fixo */}
                <div className="flex justify-end gap-2 p-4 border-t border-[oklch(var(--border-oklch))] flex-shrink-0 bg-[oklch(var(--card-oklch))]">
                  <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                  <Button type="submit" form="mobile-tx-form" disabled={isSubmitting || !categoryId}>
                    {isSubmitting ? <><LoadingSpinner /> Salvando...</> : (isEditing ? 'Salvar Alterações' : 'Salvar Transação')}
                  </Button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};