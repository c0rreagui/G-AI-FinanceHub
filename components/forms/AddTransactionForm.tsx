import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, TransactionType, Category } from '../../types';
import { ArrowDownLeft, ArrowUpRight } from '../Icons';

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// Componente para o toggle de Tipo (Receita/Despesa)
const TypeToggle: React.FC<{ selectedType: TransactionType; onTypeChange: (type: TransactionType) => void; }> = ({ selectedType, onTypeChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo
            </label>
            <div className="flex w-full bg-black/20 p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => onTypeChange(TransactionType.DESPESA)}
                    className={`w-1/2 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors ${
                        selectedType === TransactionType.DESPESA ? 'bg-red-500/80 text-white' : 'text-gray-400 hover:bg-white/5'
                    }`}
                >
                    <ArrowDownLeft className="w-4 h-4" />
                    Despesa
                </button>
                <button
                    type="button"
                    onClick={() => onTypeChange(TransactionType.RECEITA)}
                    className={`w-1/2 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold transition-colors ${
                        selectedType === TransactionType.RECEITA ? 'bg-green-500/80 text-white' : 'text-gray-400 hover:bg-white/5'
                    }`}
                >
                    <ArrowUpRight className="w-4 h-4" />
                    Receita
                </button>
            </div>
        </div>
    );
};

// Componente para o item do grid de Categorias
const CategoryGridItem: React.FC<{ category: Category; isSelected: boolean; onSelect: (id: string) => void; }> = ({ category, isSelected, onSelect }) => {
    return (
        <button
            type="button"
            onClick={() => onSelect(category.id)}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 transition-all duration-200 ${
                isSelected ? 'border-indigo-500 bg-indigo-500/20' : 'border-transparent bg-white/5 hover:bg-white/10'
            }`}
            title={category.name}
        >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
                <category.icon className="w-5 h-5" style={{ color: category.color }} />
            </div>
            <span className={`text-xs text-center truncate w-full ${isSelected ? 'text-white font-semibold' : 'text-gray-300'}`}>{category.name}</span>
        </button>
    );
};


export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ isOpen, onClose }) => {
  const { addTransaction, categories } = useDashboardData();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.DESPESA);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [account, setAccount] = useState('carteira');

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    // Reseta a categoria selecionada para evitar combinações inválidas (ex: despesa de salário)
    setCategoryId(null); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !categoryId) {
        // Idealmente, mostrar um feedback para o usuário
        console.error("Formulário incompleto");
        return;
    }

    const selectedCategory = Object.values(categories).find(c => c.id === categoryId);
    if (!selectedCategory) return;
    
    const transactionAmount = type === TransactionType.DESPESA ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

    const transactionData: Omit<Transaction, 'id'> = {
        description,
        amount: transactionAmount,
        date: new Date(date).toISOString(),
        type,
        category: selectedCategory,
        // O campo 'account' será mapeado para 'cardName' por enquanto, para fins de visualização
        cardName: account !== 'carteira' ? account.replace('-', ' ') : undefined,
    };

    try {
        await addTransaction(transactionData);
        // Reseta o formulário após o sucesso
        setDescription('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setType(TransactionType.DESPESA);
        setCategoryId(null);
        setAccount('carteira');
        onClose();
    } catch (error) {
        console.error("Falha ao adicionar transação:", error);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Transação">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tx-description" className="block text-sm font-medium text-gray-300">
            Descrição
          </label>
          <input
            type="text"
            id="tx-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tx-amount" className="block text-sm font-medium text-gray-300">
                Valor (R$)
              </label>
              <input
                type="number"
                id="tx-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                step="0.01"
                className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <TypeToggle selectedType={type} onTypeChange={handleTypeChange} />
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-300">
                Categoria
            </label>
             <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2">
                {Object.values(categories)
                    .filter(cat => {
                        if (type === TransactionType.RECEITA) {
                            return ['cat13', 'cat14'].includes(cat.id);
                        }
                        return cat.id !== 'cat13';
                    })
                    .map(cat => (
                        <CategoryGridItem 
                            key={cat.id}
                            category={cat}
                            isSelected={categoryId === cat.id}
                            onSelect={setCategoryId}
                        />
                    ))
                }
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tx-account" className="block text-sm font-medium text-gray-300">
                Conta
              </label>
              <select
                id="tx-account"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                  <option value="carteira">Carteira</option>
                  <option value="conta-corrente">Conta Corrente</option>
                  <option value="cartao-de-credito">Cartão de Crédito</option>
              </select>
            </div>
            <div>
              <label htmlFor="tx-date" className="block text-sm font-medium text-gray-300">
                Data
              </label>
              <input
                type="date"
                id="tx-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full bg-black/20 border border-white/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Transação</Button>
        </div>
      </form>
    </Modal>
  );
};