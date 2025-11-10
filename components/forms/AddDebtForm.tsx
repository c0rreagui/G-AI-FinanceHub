import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Debt } from '../../types';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setTotalAmount('');
    setInterestRate('');
    setCategory('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !totalAmount || !interestRate || isSubmitting) return;

    setIsSubmitting(true);
    const debtData: Omit<Debt, 'id' | 'paidAmount' | 'status'> = {
        name,
        totalAmount: parseFloat(totalAmount),
        interestRate: parseFloat(interestRate),
        category: category || 'Outros',
    };
    
    const success = await addDebt(debtData);
    setIsSubmitting(false);

    if (success) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Dívida">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="debt-name"
          label="Nome da Dívida"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="debt-amount"
          label="Valor Total (R$)"
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          step="0.01"
          required
        />
        <Input
          id="debt-interest"
          label="Taxa de Juros (% a.a.)"
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          step="0.01"
          required
        />
         <Input
          id="debt-category"
          label="Categoria (Opcional)"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner /> : 'Salvar Dívida'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};