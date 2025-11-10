import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Goal } from '../../types';
import { formatCurrencyBRL } from '../../utils/formatters';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';

interface AddValueToGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal; // Recebemos a meta que será atualizada
}

export const AddValueToGoalForm: React.FC<AddValueToGoalFormProps> = ({ isOpen, onClose, goal }) => {
  const { updateGoalValue } = useDashboardData();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valueToAdd = parseFloat(amount);
    if (!valueToAdd || valueToAdd <= 0 || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateGoalValue(goal.id, goal.currentAmount + valueToAdd);
      setAmount('');
      onClose();
    } catch (error) {
      // O erro já é tratado no hook com um toast
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adicionar Valor: ${goal.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-gray-300">
          Valor Atual: <span className="font-semibold text-white">{formatCurrencyBRL(goal.currentAmount)}</span> / <span className="text-gray-400">{formatCurrencyBRL(goal.targetAmount)}</span>
        </p>
        <Input
          id="goal-value-amount"
          label="Valor a Adicionar (R$)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100.00"
          step="0.01"
          required
          autoFocus
          disabled={isSubmitting}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner /> : 'Adicionar Valor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};