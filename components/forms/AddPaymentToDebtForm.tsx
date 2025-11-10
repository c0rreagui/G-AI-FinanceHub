import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Debt } from '../../types';
import { formatCurrencyBRL } from '../../utils/formatters';

interface AddPaymentToDebtFormProps {
  isOpen: boolean;
  onClose: () => void;
  debt: Debt;
}

export const AddPaymentToDebtForm: React.FC<AddPaymentToDebtFormProps> = ({ isOpen, onClose, debt }) => {
  const { addPaymentToDebt } = useDashboardData();
  const [amount, setAmount] = useState('');

  const remainingAmount = debt.totalAmount - debt.paidAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valueToAdd = parseFloat(amount);
    if (!valueToAdd || valueToAdd <= 0) {
      alert("Por favor, insira um valor de pagamento positivo.");
      return;
    }
    if (valueToAdd > remainingAmount) {
        if (!window.confirm(`O valor do pagamento (${formatCurrencyBRL(valueToAdd)}) é maior que o saldo restante (${formatCurrencyBRL(remainingAmount)}). Deseja continuar?`)) {
            return;
        }
    }

    try {
      await addPaymentToDebt(debt.id, valueToAdd);
      setAmount('');
      onClose();
    } catch (error) {
      alert("Erro ao adicionar pagamento à dívida.");
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Realizar Pagamento: ${debt.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-gray-300">
          Saldo Restante: <span className="font-bold text-white">{formatCurrencyBRL(remainingAmount)}</span>
        </p>
        <div>
          <label htmlFor="debt-payment-amount" className="block text-sm font-medium text-gray-300">
            Valor do Pagamento (R$)
          </label>
          <input
            type="number"
            id="debt-payment-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="250.00"
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
          <Button type="submit">Confirmar Pagamento</Button>
        </div>
      </form>
    </Modal>
  );
};