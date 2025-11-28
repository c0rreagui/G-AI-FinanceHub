
import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Transaction, TransactionType } from '../../types';
import { Input } from '../ui/Input';
import { TypeToggle } from '../ui/TypeToggle';
import { CategoryPicker } from '../ui/CategoryPicker';
import { LoadingSpinner } from '../LoadingSpinner';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { XIcon, Mic } from '../Icons';

// ...

const QuickValueChip: React.FC<{ value: number; onSelect: (value: number) => void }> = ({ value, onSelect }) => (
    <button
        type="button"
        onClick={() => {
          triggerHapticFeedback();
          onSelect(value);
        }}
        className="px-4 py-3 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-colors min-w-[60px] touch-manipulation"
        aria-label={`Selecionar valor rápido de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}`}
    >
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
    </button>
);

// ...

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ isOpen, onClose, prefill, transactionToEdit }) => {
  // ... existing hooks ...
  const [isListening, setIsListening] = useState(false);

  // ... existing useEffects ...

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Seu navegador não suporta reconhecimento de voz.');
        return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.start();
  };

  // ... existing logic ...

  const FormFields = (
    <>
        <motion.div variants={itemVariants} {...({} as any)}>
          <TypeToggle selectedType={type} onTypeChange={setType} />
        </motion.div>
        <motion.div variants={itemVariants} {...({} as any)}>
          <div className="flex gap-2 items-end">
              <div className="flex-grow">
                <Input
                    id="tx-description"
                    label="Descrição"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
              </div>
              <Button 
                type="button" 
                variant={isListening ? "destructive" : "secondary"} 
                className="mb-[2px] h-[42px] w-[42px] p-0 flex items-center justify-center flex-shrink-0"
                onClick={startListening}
                title="Falar descrição"
              >
                  <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
              </Button>
          </div>
        </motion.div>
        {/* ... rest of fields ... */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4" {...({} as any)}>
            <Input
              id="tx-amount"
              label="Valor (R$)"
              type="text" 
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={handleAmountBlur}
              placeholder="0.00 ou 10+5"
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
        </motion.div>
        <motion.div variants={itemVariants} {...({} as any)}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Valores Rápidos
            </label>
            <div className="flex items-center gap-2 flex-wrap">
                {quickValues.map(val => (
                    <QuickValueChip key={val} value={val} onSelect={(v) => setAmount(String(v))} />
                ))}
            </div>
        </motion.div>
        <motion.div variants={itemVariants} {...({} as any)}>
            <label className="block text-sm font-medium text-gray-300">
                Categoria
            </label>
            <CategoryPicker 
                categories={categories}
                selectedCategoryId={categoryId}
                onSelectCategory={setCategoryId}
            />
        </motion.div>
    </>
  );

  if (isDesktop) {
      return (
          <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Transação" : "Nova Transação"}>
              <motion.form 
                  onSubmit={handleSubmit} 
                  {...({ className: "space-y-4" } as any)}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
              >
                  {FormFields}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !categoryId}>
                      {isSubmitting ? <><LoadingSpinner /> Salvando...</> : (isEditing ? 'Salvar Alterações' : 'Salvar Transação')}
                    </Button>
                  </div>
              </motion.form>
          </Modal>
      )
  }

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                {...({ className: "fixed inset-0 z-50 flex flex-col bg-[oklch(var(--card-oklch))]" } as any)}
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                onAnimationComplete={() => { if (!isOpen) resetForm(); }}
            >
                {/* Header Fixo */}
                <div className="flex items-center justify-between p-4 border-b border-[oklch(var(--border-oklch))] flex-shrink-0">
                    <h2 className="text-xl font-semibold text-white">{isEditing ? "Editar Transação" : "Nova Transação"}</h2>
                    <button onClick={onClose} className="p-1 text-gray-400"><XIcon className="w-6 h-6" /></button>
                </div>
                
                {/* Conteúdo Rolável */}
                <div className="flex-grow p-4 overflow-y-auto">
                    <motion.form 
                        id="mobile-tx-form" 
                        onSubmit={handleSubmit} 
                        {...({ className: "space-y-6" } as any)}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {FormFields}
                    </motion.form>
                </div>

                {/* Rodapé Fixo */}
                <div className="flex justify-end gap-2 p-4 border-t border-[oklch(var(--border-oklch))] flex-shrink-0 bg-[oklch(var(--card-oklch))]">
                  <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                  <Button type="submit" form="mobile-tx-form" disabled={isSubmitting || !categoryId}>
                    {isSubmitting ? <><LoadingSpinner /> Salvando...</> : (isEditing ? 'Salvar Alterações' : 'Salvar Transação')}
                  </Button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};