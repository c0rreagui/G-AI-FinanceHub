import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { TransactionType, Transaction } from '../../types';
import { TypeToggle } from '../ui/TypeToggle';
import { ExtractedTransaction } from '../../services/transactionExtractor';
import { CategoryPicker } from '../ui/CategoryPicker';

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: ExtractedTransaction;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ isOpen, onClose, prefill }) => {
  const { addTransaction, categories, accounts } = useDashboardData();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.DESPESA);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');

  useEffect(() => {
    if (prefill) {
        setDescription(prefill.description || '');
        if (prefill.amount) {
            const absAmount = Math.abs(prefill.amount);
            setAmount(absAmount.toString());
            setType(prefill.amount < 0 ? TransactionType.DESPESA : TransactionType.RECEITA);
        }
    }
  }, [prefill]);

  // Set default account when accounts are loaded
  useEffect(() => {
    if (!accountId && accounts.length > 0) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);


  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategoryId(null); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !categoryId || !accountId) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    
    const transactionAmount = type === TransactionType.DESPESA ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

    const transactionData: Omit<Transaction, 'id' | 'category'> = {
        description,
        amount: transactionAmount,
        date: new Date(date).toISOString(),
        type,
        category_id: categoryId,
        account_id: accountId,
    };

    await addTransaction(transactionData);
    onClose();
  };
  
  const filteredCategories = Object.values(categories)
    .filter(cat => {
        if (type === TransactionType.RECEITA) {
            return ['cat13', 'cat14'].includes(cat.id);
        }
        return !['cat13'].includes(cat.id);
    });

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                step="0.01"
                className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <TypeToggle selectedType={type} onTypeChange={handleTypeChange} />
        </div>
        
        <CategoryPicker 
            categories={filteredCategories}
            selectedCategoryId={categoryId}
            onSelectCategory={setCategoryId}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tx-account" className="block text-sm font-medium text-gray-300">
                Conta
              </label>
              <select
                id="tx-account"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                  {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
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