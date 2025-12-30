import React, { useState, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Goal } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '../Icons';
import { useDialog } from '../../hooks/useDialog';
import { triggerHapticFeedback } from '../../utils/haptics';

interface AddValueToGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal; // Recebemos a meta que será atualizada
}

const QuickValueChip: React.FC<{ value: number; onSelect: (value: number) => void, text?: string }> = ({ value, onSelect, text }) => (
    <button
        type="button"
        onClick={() => {
          triggerHapticFeedback();
          onSelect(value);
        }}
        className="px-3 py-1.5 text-sm font-medium rounded-full bg-secondary/20 hover:bg-secondary/30 text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-primary/20"
    >
        {text || new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
    </button>
);

export const AddValueToGoalForm: React.FC<AddValueToGoalFormProps> = ({ isOpen, onClose, goal }) => {
  const { updateGoalValue } = useDashboardData();
  const { openDialog } = useDialog();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // FIX: Corrected field names to snake_case to match database schema.
  const remainingAmount = Math.max(0, goal.target_amount - goal.current_amount);

  const quickValues = useMemo(() => {
    const defaultValues = [10, 25, 50, 100];
    const smartValues: { value: number; text?: string }[] = defaultValues.map(v => ({ value: v }));
    
    if (remainingAmount > 0 && !defaultValues.includes(remainingAmount)) {
      smartValues.push({ value: remainingAmount, text: "Completar" });
    }
    return smartValues;
  }, [remainingAmount]);


  const continueSubmission = async (value: number) => {
    setIsSubmitting(true);
    const success = await updateGoalValue(goal.id, value);
    
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
            title: 'Contribuição Excedente',
            // FIX: Corrected field name to snake_case to match database schema.
            message: `O valor de ${formatCurrency(valueToAdd)} fará com que o total ultrapasse a meta de ${formatCurrency(goal.target_amount)}. Deseja continuar?`,
            confirmText: 'Sim, Continuar',
            onConfirm: () => continueSubmission(valueToAdd),
        });
    } else {
        continueSubmission(valueToAdd);
    }
  };
  
  const FormFields = (
    <>
      <p className="text-gray-300">
        {/* FIX: Corrected field names to snake_case to match database schema. */}
        Valor Atual: <span className="font-semibold text-white">{formatCurrency(goal.current_amount)}</span> / <span className="text-gray-400">{formatCurrency(goal.target_amount)}</span>
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
        disabled={isSubmitting}
      />
       <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Valores Rápidos
            </label>
            <div className="flex items-center gap-2 flex-wrap">
                {quickValues.map(item => (
                    <QuickValueChip key={item.value} value={item.value} text={item.text} onSelect={(v) => setAmount(String(v))} />
                ))}
            </div>
        </div>
    </>
  );

  if (isDesktop) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Adicionar Valor: ${goal.name}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {FormFields}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[140px] rounded-xl">
              {isSubmitting ? <><LoadingSpinner /> Adicionando...</> : 'Adicionar Valor'}
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
                    transition: { type: 'spring', stiffness: 400, damping: 40 },
                    onAnimationComplete: () => { if (!isOpen) setAmount(''); }
                } as any)}
            >
                <div className="flex items-center justify-between p-4 border-b border-border/40 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-foreground truncate max-w-[80%]">{`Adicionar a: ${goal.name}`}</h2>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label="Fechar"><XIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto">
                    <form id="mobile-add-value-goal-form" onSubmit={handleSubmit} className="space-y-6">
                        {FormFields}
                    </form>
                </div>
                <div className="flex justify-end gap-3 p-4 border-t border-border/40 flex-shrink-0 bg-background/95 backdrop-blur-sm">
                  <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="flex-1 text-muted-foreground hover:text-foreground">
                    Cancelar
                  </Button>
                  <Button type="submit" form="mobile-add-value-goal-form" disabled={isSubmitting} className="flex-1 min-w-[140px] rounded-xl">
                    {isSubmitting ? <><LoadingSpinner /> Adicionando...</> : 'Adicionar Valor'}
                  </Button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};