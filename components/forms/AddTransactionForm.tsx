import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, TransactionType } from '../../types';
import { TypeToggle } from '../ui/TypeToggle';
import { CategoryPicker } from '../ui/CategoryPicker';

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: Partial<Omit<Transaction, 'id' | 'category'>>;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ isOpen, onClose, prefill }) => {
  const { addTransaction, categories } = useDashboardData();

  const getInitialState = () => ({
    description: prefill?.description || '',
    amount: prefill?.amount ? String(Math.abs(prefill.amount)) : '',
    date: prefill?.date ? new Date(prefill.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    type: prefill?.type || TransactionType.DESPESA,
    categoryId: prefill?.category_id || null
  });

  const [description, setDescription] = useState(getInitialState().description);
  const [amount, setAmount] = useState(getInitialState().amount);
  const [date, setDate] = useState(getInitialState().date);
  const [type, setType] = useState<TransactionType>(getInitialState().type);
  const [categoryId, setCategoryId] = useState<string | null>(getInitialState().categoryId);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setType(TransactionType.DESPESA);
    setCategoryId(null);
  };

  useEffect(() => {
    if (isOpen) {
      const initialState = getInitialState();
      setDescription(initialState.description);
      setAmount(initialState.amount);
      setDate(initialState.date);
      setType(initialState.type);
      setCategoryId(initialState.categoryId);
    }
  }, [isOpen, prefill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !categoryId) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const transactionData: Omit<Transaction, 'id' | 'category'> = {
      description,
      amount: type === TransactionType.DESPESA ? -parseFloat(amount) : parseFloat(amount),
      date,
      type,
      category_id: categoryId,
    };

    addTransaction(transactionData);
    resetForm(); // Limpa o formulário imediatamente para o próximo input
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Transação">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <TypeToggle selectedType={type} onTypeChange={setType} />

        <div>
          <label htmlFor="tx-description" className="block text-sm font-medium text-gray-300">
            Descrição
          </label>
          <input
            type="text"
            id="tx-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tx-amount" className="block text-sm font-medium text-gray-300">
                Valor (R$)
              </label>
              <input
                type="number"
                id="tx-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50.00"
                step="0.01"
                className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="tx-date" className="block text-sm font-medium text-gray-300">
                Data
              </label>
              <input
                type="date"
                id="tx-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
        </div>

        <CategoryPicker 
            categories={categories}
            selectedCategoryId={categoryId}
            onSelectCategory={setCategoryId}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Transação</Button>
        </div>
      </form>
    </Modal>
  );
};