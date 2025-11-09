import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { TransactionType, ScheduledTransactionFrequency, ScheduledTransaction } from '../../types';
import { TypeToggle } from '../ui/TypeToggle';
import { CategoryPicker } from '../ui/CategoryPicker';

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
    if (!description || !amount || !startDate || !categoryId) {
        alert("Por favor, preencha todos os campos.");
        return;
    }
    
    const scheduledTxData: Omit<ScheduledTransaction, 'id' | 'category' | 'nextDueDate'> = {
        description,
        amount: type === TransactionType.DESPESA ? -parseFloat(amount) : parseFloat(amount),
        startDate,
        type,
        category_id: categoryId,
        frequency,
    };

    try {
        await addScheduledTransaction(scheduledTxData);
        resetForm();
        onClose();
    } catch (error) {
        console.error("Failed to add scheduled transaction:", error);
        alert("Ocorreu um erro ao salvar o agendamento.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Novo Agendamento">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TypeToggle selectedType={type} onTypeChange={setType} />
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-indigo-500"
          required
        />
        <input
          type="number"
          placeholder="Valor (R$)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-indigo-500"
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-indigo-500"
          required
        />
        <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as ScheduledTransactionFrequency)}
            className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-indigo-500"
        >
            {Object.values(ScheduledTransactionFrequency).map(freq => (
                <option key={freq} value={freq}>{freq}</option>
            ))}
        </select>
        <CategoryPicker 
            categories={categories}
            selectedCategoryId={categoryId}
            onSelectCategory={setCategoryId}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar Agendamento</Button>
        </div>
      </form>
    </Modal>
  );
};