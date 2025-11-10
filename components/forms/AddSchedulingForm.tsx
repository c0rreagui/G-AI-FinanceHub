import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { TransactionType, ScheduledTransactionFrequency, ScheduledTransaction } from '../../types';
import { TypeToggle } from '../ui/TypeToggle';
import { CategoryPicker } from '../ui/CategoryPicker';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';

interface AddSchedulingFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSchedulingForm: React.FC<AddSchedulingFormProps> = ({ isOpen, onClose }) => {
  const { categories, addScheduledTransaction } = useDashboardData();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.DESPESA);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [frequency, setFrequency] = useState(ScheduledTransactionFrequency.MENSAL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const resetForm = () => {
    setDescription('');
    setAmount('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setType(TransactionType.DESPESA);
    setCategoryId(null);
    setFrequency(ScheduledTransactionFrequency.MENSAL);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !startDate || !categoryId || isSubmitting) {
        return;
    }
    
    setIsSubmitting(true);
    const scheduledTxData: Omit<ScheduledTransaction, 'id' | 'category' | 'nextDueDate'> = {
        description,
        amount: type === TransactionType.DESPESA ? -parseFloat(amount) : parseFloat(amount),
        startDate,
        type,
        categoryId: categoryId,
        frequency,
    };

    const success = await addScheduledTransaction(scheduledTxData);
    setIsSubmitting(false);

    if(success) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Novo Agendamento">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TypeToggle selectedType={type} onTypeChange={setType} />
        <Input
          id="sched-description"
          label="Descrição"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="sched-amount"
            label="Valor (R$)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            required
          />
          <Input
            id="sched-start-date"
            label="Data de Início"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="sched-frequency" className="block text-sm font-medium text-gray-300">
            Frequência
          </label>
          <select
              id="sched-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as ScheduledTransactionFrequency)}
              className="mt-1 block w-full bg-black/20 border border-white/20 rounded-xl shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
          >
              {Object.values(ScheduledTransactionFrequency).map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
              ))}
          </select>
        </div>
        <CategoryPicker 
            categories={categories}
            selectedCategoryId={categoryId}
            onSelectCategory={setCategoryId}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner /> : 'Salvar Agendamento'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};