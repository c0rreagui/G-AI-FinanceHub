import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, TransactionType } from '../../types';

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ isOpen, onClose }) => {
  const { addTransaction, categories } = useDashboardData();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.DESPESA);
  // FIX: Initialize state by getting the first category from the array of values.
  const [categoryId, setCategoryId] = useState(Object.values(categories)[0]?.id || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !categoryId) return;

    // FIX: Find the selected category from the array of values.
    const selectedCategory = Object.values(categories).find(c => c.id === categoryId);
    if (!selectedCategory) return;
    
    const transactionAmount = type === TransactionType.DESPESA ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

    // FIX: Ensure the transaction object matches the Omit<Transaction, 'id'> type by including the 'category' property.
    const transactionData: Omit<Transaction, 'id'> = {
        description,
        amount: transactionAmount,
        date: new Date(date).toISOString(),
        type,
        category_id: selectedCategory.id,
        category: selectedCategory,
    };

    try {
        await addTransaction(transactionData);
        onClose();
    } catch (error) {
        console.error("Failed to add transaction:", error);
        // Here you could show an error message to the user
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Transação">
      <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="100.00"
                className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
             <div>
              <label htmlFor="tx-type" className="block text-sm font-medium text-gray-300">
                Tipo
              </label>
              <select
                id="tx-type"
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                  <option value={TransactionType.DESPESA}>Despesa</option>
                  <option value={TransactionType.RECEITA}>Receita</option>
              </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="tx-category" className="block text-sm font-medium text-gray-300">
                    Categoria
                </label>
                <select
                    id="tx-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    {/* FIX: Map over the array of category values instead of the record. */}
                    {Object.values(categories).map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
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
