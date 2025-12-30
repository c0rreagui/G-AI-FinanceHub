import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ScheduledTransaction, TransactionType, ScheduledTransactionFrequency } from '../../types';
import { Input } from '../ui/Input';
import { TypeToggle } from '../ui/TypeToggle';
import { CategoryPicker } from '../ui/CategoryPicker';
import { LoadingSpinner } from '../LoadingSpinner';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ChevronDown } from '../Icons';

interface AddSchedulingFormProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: ScheduledTransaction;
}

export const AddSchedulingForm: React.FC<AddSchedulingFormProps> = ({ isOpen, onClose, itemToEdit }) => {
  const { addScheduledTransaction, updateScheduledTransaction, categories } = useDashboardData();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.DESPESA);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [frequency, setFrequency] = useState<ScheduledTransactionFrequency>(ScheduledTransactionFrequency.MENSAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!itemToEdit;

  useEffect(() => {
    if (isEditing && itemToEdit && isOpen) {
        setDescription(itemToEdit.description);
        setAmount(String(Math.abs(itemToEdit.amount)));
        setType(itemToEdit.type);
        // FIX: Corrected field name to snake_case to match database schema.
        setCategoryId(itemToEdit.category_id);
        // FIX: Corrected field name to snake_case to match database schema.
        setStartDate(itemToEdit.start_date.split('T')[0]);
        setFrequency(itemToEdit.frequency);
    }
  }, [itemToEdit, isEditing, isOpen]);


  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType(TransactionType.DESPESA);
    setCategoryId(null);
    setStartDate(new Date().toISOString().split('T')[0]);
    setFrequency(ScheduledTransactionFrequency.MENSAL);
  };
  
  useEffect(() => {
    if (!isOpen) {
        setTimeout(resetForm, 200);
    }
  }, [isOpen])




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number.parseFloat(amount);
    if (!description || !amount || Number.isNaN(numericAmount) || !categoryId || !startDate || !frequency || isSubmitting) return;

    setIsSubmitting(true);
    const finalAmount = type === TransactionType.DESPESA ? -Math.abs(numericAmount) : Math.abs(numericAmount);

    let success = false;
    if(isEditing) {
        // FIX: Use snake_case for database fields.
        const updatedTxData = {
            id: itemToEdit.id,
            description,
            amount: finalAmount,
            type,
            categoryId,
            startDate,
            frequency,
            next_due_date: itemToEdit.next_due_date,
            created_at: itemToEdit.created_at,
        };
        success = await updateScheduledTransaction(updatedTxData);
    } else {
        // FIX: Use snake_case for database fields.
        const scheduledTxData = {
            description,
            amount: finalAmount,
            type,
            categoryId,
            startDate,
            frequency,
            created_at: new Date().toISOString(),
        };
        success = await addScheduledTransaction(scheduledTxData);
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
          id="sch-description"
          label="Descrição"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          id="sch-amount"
          label="Valor (R$)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="75.00"
          step="0.01"
          required
        />
        <div className="grid grid-cols-2 gap-4">
            <Input
              id="sch-start-date"
              label="Data de Início"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <div className="relative">
              <label htmlFor="sch-frequency" className="block text-sm font-medium text-gray-300 mb-1.5">Frequência</label>
              <select
                id="sch-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as ScheduledTransactionFrequency)}
                className="appearance-none block w-full bg-[oklch(var(--background-oklch))] border border-[oklch(var(--border-oklch))] rounded-lg shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[oklch(var(--primary-oklch))] focus:border-[oklch(var(--primary-oklch))] sm:text-sm transition"
              >
                {Object.values(ScheduledTransactionFrequency).map(f => (
                  <option key={f} value={f} className="bg-oklch-background text-white">{f}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-[calc(50%+0.3rem)] -translate-y-1/2 pointer-events-none" />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300">
                Categoria
            </label>
            <CategoryPicker 
                categories={categories}
                selectedCategoryId={categoryId}
                onSelectCategory={(id) => {
                    console.error('[DEBUG] onSelectCategory called with:', id);
                    setCategoryId(id);
                }}
            />
        </div>
    </>
  );

  if (isDesktop) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            {FormFields}
            <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !categoryId}>
                {isSubmitting ? <><LoadingSpinner /> Salvando...</> : (isEditing ? 'Salvar Alterações' : 'Salvar Agendamento')}
            </Button>
            </div>
        </form>
        </Modal>
    );
  }

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                {...({
                    className: "fixed inset-0 z-[110] flex flex-col bg-[oklch(var(--background-oklch))]",
                    initial: { y: '100%' },
                    animate: { y: '0%' },
                    exit: { y: '100%' },
                    transition: { type: 'spring', stiffness: 400, damping: 40 }
                } as any)}
            >
                <div className="flex items-center justify-between p-4 border-b border-[oklch(var(--border-oklch))] flex-shrink-0">
                    <h2 className="text-xl font-semibold text-white">{isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
                    <button onClick={onClose} className="p-1 text-gray-400" aria-label="Fechar"><XIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto">
                    <form id="mobile-scheduling-form" onSubmit={handleSubmit} className="space-y-6">
                        {FormFields}
                    </form>
                </div>
                <div className="flex justify-end gap-2 p-4 border-t border-[oklch(var(--border-oklch))] flex-shrink-0">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button type="submit" form="mobile-scheduling-form" disabled={isSubmitting || !categoryId}>
                        {isSubmitting ? <><LoadingSpinner /> Salvando...</> : 'Salvar'}
                    </Button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  )
};