import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Goal } from '../../types';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';

interface AddGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ isOpen, onClose }) => {
  const { addGoal } = useDashboardData();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setTargetAmount('');
    setDeadline('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadline || isSubmitting) return;

    setIsSubmitting(true);
    const goalData: Omit<Goal, 'id' | 'currentAmount' | 'status'> = {
        name,
        targetAmount: parseFloat(targetAmount),
        deadline: new Date(deadline).toISOString(),
    };

    const success = await addGoal(goalData);
    setIsSubmitting(false);

    if(success) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Meta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="goal-name"
          label="Nome da Meta"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="goal-amount"
          label="Valor Alvo (R$)"
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="5000.00"
          step="0.01"
          required
        />
        <Input
          id="goal-deadline"
          label="Prazo Final"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <><LoadingSpinner /> Salvando...</> : 'Salvar Meta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};