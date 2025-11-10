import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, TransactionType } from '../../types';
import { Input } from '../ui/Input';
import { TypeToggle } from '../ui/TypeToggle';
import { CategoryPicker } from '../ui/CategoryPicker';
import { LoadingSpinner } from '../LoadingSpinner';

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: Partial<Transaction>;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ isOpen, onClose, prefill }) => {
  const { addTransaction, updateTransaction, categories } = useDashboardData();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.DESPESA);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!prefill?.id;

  useEffect(() => {
    if (isOpen && prefill) {
      setDescription(prefill.description || '');
      setAmount(prefill.amount ? String(Math.abs(prefill.amount)) : '');
      setDate(prefill.date ? new Date(prefill.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setType(prefill.type || TransactionType.DESPESA);
      setCategoryId(prefill.categoryId || null);
    } else if (isOpen) {
        // Reset for new transaction, keeping prefilled type if available
        resetForm(prefill?.type);
    }
  }, [prefill, isOpen]);

  const resetForm = (defaultType: TransactionType = TransactionType.DESPESA) => {
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setType(defaultType);
    setCategoryId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !categoryId || isSubmitting) return;
    
    setIsSubmitting(true);
    
    const transactionData = {
      description,
      amount: parseFloat(amount),
      date,
      type,
      categoryId,
    };

    let success = false;
    if (isEditing) {
        success = await updateTransaction(prefill.id!, transactionData);
    } else {
        success = await addTransaction(transactionData);
    }
    
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Transação" : "Adicionar Transação"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TypeToggle selectedType={type} onTypeChange={setType} />
        <Input
          id="tx-description"
          label="Descrição"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-4">
            <Input
              id="tx-amount"
              label="Valor (R$)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              step="0.01"
              required
            />
            <Input
              id="tx-date"
              label="Data"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
        </div>
        <CategoryPicker 
            categories={categories}
            selectedCategoryId={categoryId}
            onSelectCategory={setCategoryId}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || !categoryId}>
            {isSubmitting ? <LoadingSpinner /> : (isEditing ? 'Salvar Alterações' : 'Salvar Transação')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
