import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Debt } from '../../types';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '../Icons';
import { useDialog } from '../../hooks/useDialog';

interface AddDebtFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDebtForm: React.FC<AddDebtFormProps> = ({ isOpen, onClose }) => {
  const { addDebt } = useDashboardData();
  const { openDialog } = useDialog();
  const isDesktop = useMediaQuery('(min-width: 768px)');
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
    const parsedAmount = parseFloat(totalAmount);
    const parsedRate = parseFloat(interestRate);
    if (!name || !totalAmount || !interestRate || isNaN(parsedAmount) || isNaN(parsedRate) || isSubmitting) return;

    setIsSubmitting(true);
    // FIX: Removed incorrect type annotation to allow type inference to match the `addDebt` function signature.
    const debtData = {
        name,
        totalAmount: parsedAmount,
        interestRate: parsedRate,
        category: category || 'Outros',
        created_at: new Date().toISOString()
    };
    
    const newDebt = await addDebt(debtData);
    setIsSubmitting(false);

    if (newDebt) {
      resetForm();
      onClose();
      // Abre proativamente o modal para realizar o primeiro pagamento
      openDialog('add-payment-to-debt', { debt: newDebt });
    }
  };

  const FormFields = (
    <>
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
    </>
  );

  if (isDesktop) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Dívida">
        <form onSubmit={handleSubmit} className="space-y-4">
          {FormFields}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[140px] rounded-xl">
              {isSubmitting ? <><LoadingSpinner /> Salvando...</> : 'Salvar Dívida'}
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
            <h2 className="text-xl font-semibold text-foreground">Nova Dívida</h2>
            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label="Fechar"><XIcon className="w-6 h-6" /></button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            <form id="mobile-debt-form" onSubmit={handleSubmit} className="space-y-6">
              {FormFields}
            </form>
          </div>
          <div className="flex justify-end gap-3 p-4 border-t border-border/40 flex-shrink-0 bg-background/95 backdrop-blur-sm">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="flex-1 text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
            <Button type="submit" form="mobile-debt-form" disabled={isSubmitting} className="flex-1 min-w-[140px] rounded-xl">
              {isSubmitting ? <><LoadingSpinner /> Salvando...</> : 'Salvar Dívida'}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
