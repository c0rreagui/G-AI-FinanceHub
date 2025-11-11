import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Debt } from '../../types';
import { formatCurrencyBRL } from '../../utils/formatters';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '../Icons';

interface AddPaymentToDebtFormProps {
  isOpen: boolean;
  onClose: () => void;
  debt: Debt;
}

export const AddPaymentToDebtForm: React.FC<AddPaymentToDebtFormProps> = ({ isOpen, onClose, debt }) => {
  const { addPaymentToDebt } = useDashboardData();
  const isDesktop = useMediaQuery('(min-width: 768px)');
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

    if (success) {
      setAmount('');
      onClose();
    }
    setIsSubmitting(false);
  };
  
  const FormFields = (
    <>
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
    </>
  );

  if (isDesktop) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Realizar Pagamento: ${debt.name}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {FormFields}
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
  }

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                className="fixed inset-0 z-50 flex flex-col bg-[oklch(var(--background-oklch))]"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
                <div className="flex items-center justify-between p-4 border-b border-[oklch(var(--border-oklch))] flex-shrink-0">
                    <h2 className="text-xl font-semibold text-white truncate max-w-[80%]">{`Pagar: ${debt.name}`}</h2>
                    <button onClick={onClose} className="p-1 text-gray-400"><XIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto">
                    <form id="mobile-add-payment-debt-form" onSubmit={handleSubmit} className="space-y-6">
                        {FormFields}
                    </form>
                </div>
                <div className="flex justify-end gap-2 p-4 border-t border-[oklch(var(--border-oklch))] flex-shrink-0">
                  <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                  <Button type="submit" form="mobile-add-payment-debt-form" disabled={isSubmitting}>
                    {isSubmitting ? <><LoadingSpinner/> Confirmando...</> : 'Confirmar Pagamento'}
                  </Button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};