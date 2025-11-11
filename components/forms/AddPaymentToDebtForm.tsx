import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Debt } from '../../types';
import { formatCurrencyBRL } from '../../utils/formatters';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';

interface AddPaymentToDebtFormProps {
  isOpen: boolean;
  onClose: () => void;
  debt: Debt;
}

export const AddPaymentToDebtForm: React.FC<AddPaymentToDebtFormProps> = ({ isOpen, onClose, debt }) => {
  const { addPaymentToDebt } = useDashboardData();
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const remainingAmount = debt.totalAmount - debt.paidAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valueToAdd = parseFloat(amount);
    if (!valueToAdd || valueToAdd <= 0 || isSubmitting) {
      return;
    }
    if (valueToAdd > remainingAmount) {
        if (!window.confirm(`O valor do pagamento (${formatCurrencyBRL(valueToAdd)}) é maior que o saldo restante (${formatCurrencyBRL(remainingAmount)}). Deseja continuar?`)) {
            return;
        }
    }
    
    setIsSubmitting(true);
    const success = await addPaymentToDebt(debt.id, valueToAdd);

    // O modal só fecha se a operação completa (dívida + transação) for bem-sucedida.
    if (success) {
      setAmount('');
      onClose();
    }
    // Se 'success' for falso, o erro já foi exibido por um toast no hook,
    // e o modal permanece aberto para o usuário.
    setIsSubmitting(false);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Realizar Pagamento: ${debt.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-gray-300">
          Saldo Restante: <span className="font-bold text-white">{formatCurrencyBRL(remainingAmount)}</span>
        </p>
        <Input
          id="debt-payment-amount"
          label="Valor do Pagamento (R$)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="250.00"
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
            {isSubmitting ? <><LoadingSpinner/> Confirmando...</> : 'Confirmar Pagamento'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};