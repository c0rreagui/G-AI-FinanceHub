import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Goal } from '../../types';
import { formatCurrencyBRL } from '../../utils/formatters';

interface AddValueToGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal; // Recebemos a meta que será atualizada
}

export const AddValueToGoalForm: React.FC<AddValueToGoalFormProps> = ({ isOpen, onClose, goal }) => {
  const { updateGoalValue } = useDashboardData(); // Usaremos uma nova função
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valueToAdd = parseFloat(amount);
    if (!valueToAdd || valueToAdd <= 0) {
      alert("Por favor, insira um valor positivo.");
      return;
    }
    try {
      await updateGoalValue(goal.id, goal.currentAmount + valueToAdd);
      setAmount('');
      onClose();
    } catch (error) {
      alert("Erro ao adicionar valor à meta.");
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adicionar Valor: ${goal.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-gray-300">
          Valor Atual: {formatCurrencyBRL(goal.currentAmount)}
        </p>
        <div>
          <label htmlFor="goal-value-amount" className="block text-sm font-medium text-gray-300">
            Valor a Adicionar (R$)
          </label>
          <input
            type="number"
            id="goal-value-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100.00"
            step="0.01"
            className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500"
            required
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Adicionar Valor</Button>
        </div>
      </form>
    </Modal>
  );
};