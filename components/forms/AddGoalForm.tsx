import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Goal } from '../../types';

interface AddGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ isOpen, onClose }) => {
  const { addGoal } = useDashboardData();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadline) return;

    const goalData: Omit<Goal, 'id' | 'currentAmount' | 'status'> = {
        name,
        targetAmount: parseFloat(targetAmount),
        deadline: new Date(deadline).toISOString(),
    };

    addGoal(goalData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Meta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal-name" className="block text-sm font-medium text-gray-300">
            Nome da Meta
          </label>
          <input
            type="text"
            id="goal-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="goal-amount" className="block text-sm font-medium text-gray-300">
            Valor Alvo (R$)
          </label>
          <input
            type="number"
            id="goal-amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="5000.00"
            className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="goal-deadline" className="block text-sm font-medium text-gray-300">
            Prazo Final
          </label>
          <input
            type="date"
            id="goal-deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Meta</Button>
        </div>
      </form>
    </Modal>
  );
};