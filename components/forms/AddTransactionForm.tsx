import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, TransactionType } from '../../types';
import { TypeToggle } from '../ui/TypeToggle';
import { CategoryPicker } from '../ui/CategoryPicker';
import { TrashIcon } from '../Icons';

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: Partial<Omit<Transaction, 'id' | 'category'>> | Transaction;
}

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="mt-1 block w-full bg-black/20 border border-white/20 rounded-xl shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
  />
);

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ isOpen, onClose, prefill }) => {
  const { addTransaction, categories, updateTransaction, deleteTransaction } = useDashboardData();

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
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (!description || !amount || !date || !categoryId) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    const transactionData = {
      description,
      amount: parseFloat(amount),
      date,
      type,
      categoryId: categoryId,
    };
    
    let success = false;
    if (prefill && 'id' in prefill) {
        // MODO DE ATUALIZAÇÃO
        success = await updateTransaction(prefill.id, transactionData);
    } else {
        // MODO DE CRIAÇÃO
        success = await addTransaction(transactionData);
    }
    
    if (success) {
      resetForm();
      onClose();
    }
  };

  const handleDelete = async () => {
    if (prefill && 'id' in prefill) {
        if (window.confirm("Tem certeza que deseja deletar esta transação?")) {
            setIsDeleting(true);
            try {
                await deleteTransaction(prefill.id);
                resetForm();
                onClose();
            } catch (error) {
                alert("Erro ao deletar transação.");
            } finally {
                setIsDeleting(false);
            }
        }
    }
  };

  const isEditMode = prefill && 'id' in prefill;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Editar Transação" : "Adicionar Nova Transação"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <TypeToggle selectedType={type} onTypeChange={setType} />

        <div>
          <label htmlFor="tx-description" className="block text-sm font-medium text-gray-300">
            Descrição
          </label>
          <FormInput
            type="text"
            id="tx-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tx-amount" className="block text-sm font-medium text-gray-300">
                Valor (R$)
              </label>
              <FormInput
                type="number"
                id="tx-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50.00"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="tx-date" className="block text-sm font-medium text-gray-300">
                Data
              </label>
              <FormInput
                type="date"
                id="tx-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
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
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <TrashIcon className="w-4 h-4" />
              {isDeleting ? 'Excluindo...' : ''}
            </Button>
          ) : (
            <div></div> /* Espaçador */
          )}

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Transação</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
