import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { CategoryPicker } from '../ui/CategoryPicker';
import { LoadingSpinner } from '../LoadingSpinner';

interface BulkRecategorizeFormProps {
  isOpen: boolean;
  onClose: () => void;
  transactionIds: string[];
  onComplete: () => void;
}

export const BulkRecategorizeForm: React.FC<BulkRecategorizeFormProps> = ({ isOpen, onClose, transactionIds, onComplete }) => {
  const { categories, updateTransactionsCategory } = useDashboardData();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || isSubmitting) return;

    setIsSubmitting(true);
    const success = await updateTransactionsCategory(transactionIds, selectedCategoryId);
    setIsSubmitting(false);

    if (success) {
      onComplete();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Recategorizar ${transactionIds.length} Transações`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-400">Selecione a nova categoria para as transações selecionadas.</p>
        <CategoryPicker
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!selectedCategoryId || isSubmitting}>
            {isSubmitting ? <><LoadingSpinner /> Salvando...</> : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};