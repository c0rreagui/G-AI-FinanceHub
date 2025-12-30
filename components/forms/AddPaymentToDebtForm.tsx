import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Debt } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '../Icons';
import { useDialog } from '../../hooks/useDialog';
import { triggerHapticFeedback } from '../../utils/haptics';

interface AddPaymentToDebtFormProps {
  isOpen: boolean;
  onClose: () => void;
  debt: Debt;
}

const QuickValueChip: React.FC<{ value: number; onSelect: (value: number) => void }> = ({ value, onSelect }) => (
    <button
        type="button"
        onClick={() => {
          triggerHapticFeedback();
          onSelect(value);
        }}
        className="px-3 py-1.5 text-sm font-medium rounded-full bg-secondary/20 hover:bg-secondary/30 text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-primary/20"
    >
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
    </button>
);

export const AddPaymentToDebtForm: React.FC<AddPaymentToDebtFormProps> = ({ isOpen, onClose, debt }) => {
  const { addPaymentToDebt } = useDashboardData();
  const { openDialog } = useDialog();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quickValues = [50, 100, 250, 500];

  // FIX: Corrected field names to snake_case to match database schema.
  const remainingAmount = debt.total_amount - debt.paid_amount;

  const continueSubmission = async (paymentValue: number) => {
    setIsSubmitting(true);
    const success = await addPaymentToDebt(debt.id, paymentValue);

    if (success) {
      setAmount('');
      onClose();
    }
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valueToAdd = parseFloat(amount);
    if (Number.isNaN(valueToAdd) || valueToAdd <= 0 || isSubmitting) {
      return;
    }
    
    if (valueToAdd > remainingAmount) {
        openDialog('confirmation', {
            title: 'Pagamento Excedente',
            message: `O valor do pagamento (${formatCurrency(valueToAdd)}) é maior que o saldo restante (${formatCurrency(remainingAmount)}). Deseja continuar? O valor final pago excederá o total da dívida.`,
            confirmText: 'Sim, Continuar',
            confirmVariant: 'destructive',
            onConfirm: () => continueSubmission(valueToAdd),
        });
    } else {
        continueSubmission(valueToAdd);
    }
  };
  
  const FormFields = (
    <>
      <p className="text-gray-300">
        Saldo Restante: <span className="font-bold text-white">{formatCurrency(remainingAmount)}</span>
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
        disabled={isSubmitting}
      />
      <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Valores Rápidos
            </label>
            <div className="flex items-center gap-2 flex-wrap">
                {quickValues.map(val => (
                    <QuickValueChip key={val} value={val} onSelect={(v) => setAmount(String(v))} />
                ))}
            </div>
        </div>
    </>
  );

  if (isDesktop) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Realizar Pagamento: ${debt.name}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {FormFields}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[140px] rounded-xl">
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
                {...({
                    className: "fixed inset-0 z-[110] flex flex-col bg-background",
                    initial: { y: '100%' },
                    animate: { y: '0%' },
                    exit: { y: '100%' },
                    transition: { type: 'spring', stiffness: 400, damping: 40 }
                } as any)}
            >
                <div className="flex items-center justify-between p-4 border-b border-border/40 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-foreground truncate max-w-[80%]">{`Pagar: ${debt.name}`}</h2>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label="Fechar"><XIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto">
                    <form id="mobile-add-payment-debt-form" onSubmit={handleSubmit} className="space-y-6">
                        {FormFields}
                    </form>
                </div>
                <div className="flex justify-end gap-3 p-4 border-t border-border/40 flex-shrink-0 bg-background/95 backdrop-blur-sm">
                  <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="flex-1 text-muted-foreground hover:text-foreground">
                    Cancelar
                  </Button>
                  <Button type="submit" form="mobile-add-payment-debt-form" disabled={isSubmitting} className="flex-1 min-w-[140px] rounded-xl">
                    {isSubmitting ? <><LoadingSpinner/> Confirmando...</> : 'Confirmar Pagamento'}
                  </Button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};