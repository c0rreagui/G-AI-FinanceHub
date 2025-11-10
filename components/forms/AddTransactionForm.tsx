import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, TransactionType } from '../../types';
import { TypeToggle } from '../ui/TypeToggle';
import { CategoryPicker } from '../ui/CategoryPicker';
import { TrashIcon } from '../Icons';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: Partial<Omit<Transaction, 'id' | 'category'>> | Transaction;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ isOpen, onClose, prefill }) => {
  const { addTransaction, categories, updateTransaction, deleteTransaction } = useDashboardData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getInitialState = () => ({
    description: prefill?.description || '',
    amount: prefill?.amount ? String(Math.abs(prefill.amount)) : '',
    date: prefill?.date ? new Date(prefill.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    type: prefill?.amount && prefill.amount < 0 ? TransactionType.DESPESA : (prefill?.type || TransactionType.DESPESA),
    categoryId: prefill?.categoryId || null
  });

  const [description, setDescription] = useState(getInitialState().description);
  const [amount, setAmount] = useState(getInitialState().amount);
  const [date, setDate] = useState(getInitialState().date);
  const [type, setType] = useState<TransactionType>(getInitialState().type);
  const [categoryId, setCategoryId] = useState<string | null>(getInitialState().categoryId);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setType(TransactionType.DESPESA);
    setCategoryId(null);
  };

  useEffect(() => {
    if (isOpen) {
      const initialState = getInitialState();
      setDescription(initialState.description);
      setAmount(initialState.amount);
      setDate(initialState.date);
      setType(initialState.type);
      setCategoryId(initialState.categoryId);
    }
  }, [isOpen, prefill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !categoryId || isSubmitting) {
        return;
    }
    
    setIsSubmitting(true);
    const transactionData = {
      description,
      amount: parseFloat(amount),
      date,
      type,
      categoryId: categoryId,
    };
    
    let success = false;
    if (prefill && 'id' in prefill) {
        success = await updateTransaction(prefill.id, transactionData);
    } else {
        success = await addTransaction(transactionData);
    }
    
    setIsSubmitting(false);
    if (success) {
      resetForm();
      onClose();
    }
  };

  const handleDelete = async () => {
    if (prefill && 'id' in prefill) {
        setIsDeleting(true);
        const success = await deleteTransaction(prefill.id);
        setIsDeleting(false);
        if (success) {
            setShowDeleteConfirm(false);
            resetForm();
            onClose();
        }
    }
  };

  const isEditMode = prefill && 'id' in prefill;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Transação" : "Adicionar Nova Transação"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <TypeToggle selectedType={type} onTypeChange={setType} />

          <Input
            id="tx-description"
            label="Descrição"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isSubmitting}
          />
          
          <div className="grid grid-cols-2 gap-4">
              <Input
                id="tx-amount"
                label="Valor (R$)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50.00"
                step="0.01"
                required
                disabled={isSubmitting}
              />
              <Input
                id="tx-date"
                label="Data"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isSubmitting}
              />
          </div>

          <CategoryPicker 
              categories={categories}
              selectedCategoryId={categoryId}
              onSelectCategory={setCategoryId}
          />
          
          <div className="flex justify-between items-center gap-2 pt-4">
            {isEditMode ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting || isDeleting}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            ) : (
              <div></div> /* Espaçador */
            )}

            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <LoadingSpinner /> : isEditMode ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        confirmText={isDeleting ? 'Excluindo...' : 'Excluir'}
        confirmVariant="destructive"
      >
        <p>Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.</p>
      </ConfirmationModal>
    </>
  );
};