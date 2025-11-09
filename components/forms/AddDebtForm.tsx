import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Debt } from '../../types';

interface AddDebtFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDebtForm: React.FC<AddDebtFormProps> = ({ isOpen, onClose }) => {
  const { addDebt } = useDashboardData();
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [category, setCategory] = useState('');

  const resetForm = () => {
    setName('');
    setTotalAmount('');
    setInterestRate('');
    setCategory('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !totalAmount || !interestRate) return;

    const debtData: Omit<Debt, 'id' | 'paidAmount' | 'status'> = {
        name,
        totalAmount: parseFloat(totalAmount),
        interestRate: parseFloat(interestRate),
        category: category || 'Outros',
    };
    
    await addDebt(debtData);
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Dívida">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="debt-name" className="block text-sm font-medium text-gray-300">
            Nome da Dívida
          </label>
          <input
            type="text"
            id="debt-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="debt-amount" className="block text-sm font-medium text-gray-300">
            Valor Total (R$)
          </label>
          <input
            type="number"
            id="debt-amount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="debt-interest" className="block text-sm font-medium text-gray-300">
            Taxa de Juros (% a.a.)
          </label>
          <input
            type="number"
            id="debt-interest"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
         <div>
          <label htmlFor="debt-category" className="block text-sm font-medium text-gray-300">
            Categoria (Opcional)
          </label>
          <input
            type="text"
            id="debt-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Dívida</Button>
        </div>
      </form>
    </Modal>
  );
};