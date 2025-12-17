import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Goal } from '../../types';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '../Icons';
import { useDialog } from '../../hooks/useDialog';

interface AddGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ isOpen, onClose }) => {
  const { addGoal } = useDashboardData();
  const { openDialog } = useDialog();
  const isDesktop = useMediaQuery('(min-width: 768px)');
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
    const parsedAmount = parseFloat(targetAmount);
    if (!name || !targetAmount || !deadline || isNaN(parsedAmount) || isSubmitting) return;

    setIsSubmitting(true);

    // Constrói a data em UTC para evitar problemas de fuso horário.
    const [year, month, day] = deadline.split('-').map(Number);
    const utcDeadline = new Date(Date.UTC(year, month - 1, day));
    
    // FIX: Removed incorrect type annotation to allow type inference to match the `addGoal` function signature.
    const goalData = {
        name,
        targetAmount: parsedAmount,
        deadline: utcDeadline.toISOString(),
        created_at: new Date().toISOString()
    };

    const newGoal = await addGoal(goalData);
    setIsSubmitting(false);

    if(newGoal) {
      resetForm();
      onClose();
      // Abre proativamente o modal para adicionar a primeira contribuição
      openDialog('add-value-to-goal', { goal: newGoal });
    }
  };
  
  const FormFields = (
    <>
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
    </>
  );

  if (isDesktop) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Meta">
        <form onSubmit={handleSubmit} className="space-y-4">
          {FormFields}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/40 mt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[140px] rounded-xl">
              {isSubmitting ? <><LoadingSpinner /> Salvando...</> : 'Salvar Meta'}
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
              onAnimationComplete: () => { if (!isOpen) resetForm(); }
          } as any)}
        >
          <div className="flex items-center justify-between p-4 border-b border-border/40 flex-shrink-0">
            <h2 className="text-xl font-semibold text-foreground">Nova Meta</h2>
            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label="Fechar"><XIcon className="w-6 h-6" /></button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            <form id="mobile-goal-form" onSubmit={handleSubmit} className="space-y-6">
              {FormFields}
            </form>
          </div>
          <div className="flex justify-end gap-3 p-4 border-t border-border/40 flex-shrink-0 bg-background/95 backdrop-blur-sm">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="flex-1 text-muted-foreground hover:text-foreground">
              Cancelar
            </Button>
            <Button type="submit" form="mobile-goal-form" disabled={isSubmitting} className="flex-1 min-w-[140px] rounded-xl">
              {isSubmitting ? <><LoadingSpinner /> Salvando...</> : 'Salvar Meta'}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
