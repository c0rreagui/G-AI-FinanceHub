import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ScheduledTransaction, TransactionType, ScheduledTransactionFrequency } from '../../types';
import { Input } from '../ui/Input';
import { TypeToggle } from '../ui/TypeToggle';
import { CategoryPicker } from '../ui/CategoryPicker';
import { LoadingSpinner } from '../LoadingSpinner';

interface AddSchedulingFormProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: Partial<ScheduledTransaction>;
}

export const AddSchedulingForm: React.FC<AddSchedulingFormProps> = ({ isOpen, onClose, prefill }) => {
  const { addScheduledTransaction, categories } = useDashboardData();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.DESPESA);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [frequency, setFrequency] = useState<ScheduledTransactionFrequency>(ScheduledTransactionFrequency.MENSAL);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
      if (!isOpen) {
          resetForm();
      }
  }, [isOpen])

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType(TransactionType.DESPESA);
    setCategoryId(null);
    setStartDate(new Date().toISOString().split('T')[0]);
    setFrequency(ScheduledTransactionFrequency.MENSAL);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !categoryId || !startDate || !frequency || isSubmitting) return;

    setIsSubmitting(true);
    
    // FIX: Garante que o valor seja negativo para despesas, corrigindo um bug crítico.
    const numericAmount = parseFloat(amount);
    const finalAmount = type === TransactionType.DESPESA ? -Math.abs(numericAmount) : Math.abs(numericAmount);

    const scheduledTxData = {
        description,
        amount: finalAmount,
        type,
        categoryId,
        startDate,
        frequency,
    };
    
    const success = await addScheduledTransaction(scheduledTxData);
    setIsSubmitting(false);

    if (success) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Agendamento">
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <div>
              <label htmlFor="sch-frequency" className="block text-sm font-medium text-gray-300">Frequência</label>
              <select
                id="sch-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as ScheduledTransactionFrequency)}
                className="mt-1 block w-full bg-black/20 border border-white/20 rounded-xl shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
              >
                {Object.values(ScheduledTransactionFrequency).map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
        </div>
        <CategoryPicker 
            categories={categories}
            selectedCategoryId={categoryId}
            onSelectCategory={setCategoryId}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || !categoryId}>
            {isSubmitting ? <LoadingSpinner /> : 'Salvar Agendamento'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};