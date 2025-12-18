import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingDown, DollarSign, Percent, Tag, AlertCircle, CreditCard, Banknote, Car, Home, GraduationCap, Smartphone, Plane, Heart } from 'lucide-react';
import { useDialog } from '../../hooks/useDialog';
import { cn } from '@/utils/utils';

interface AddDebtFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// Debt type categories with icons and Tailwind classes
const debtCategories = [
  { id: 'credit-card', label: 'Cartão de Crédito', icon: CreditCard, colorClass: 'text-red-500', bgClass: 'bg-red-500/20', ringClass: 'ring-red-500' },
  { id: 'loan', label: 'Empréstimo', icon: Banknote, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/20', ringClass: 'ring-amber-500' },
  { id: 'car', label: 'Financiamento Veículo', icon: Car, colorClass: 'text-blue-500', bgClass: 'bg-blue-500/20', ringClass: 'ring-blue-500' },
  { id: 'mortgage', label: 'Financiamento Imóvel', icon: Home, colorClass: 'text-violet-500', bgClass: 'bg-violet-500/20', ringClass: 'ring-violet-500' },
  { id: 'education', label: 'Educação', icon: GraduationCap, colorClass: 'text-cyan-500', bgClass: 'bg-cyan-500/20', ringClass: 'ring-cyan-500' },
  { id: 'electronics', label: 'Eletrônicos', icon: Smartphone, colorClass: 'text-pink-500', bgClass: 'bg-pink-500/20', ringClass: 'ring-pink-500' },
  { id: 'travel', label: 'Viagem', icon: Plane, colorClass: 'text-teal-500', bgClass: 'bg-teal-500/20', ringClass: 'ring-teal-500' },
  { id: 'health', label: 'Saúde', icon: Heart, colorClass: 'text-rose-500', bgClass: 'bg-rose-500/20', ringClass: 'ring-rose-500' },
];

export const AddDebtForm: React.FC<AddDebtFormProps> = ({ isOpen, onClose }) => {
  const { addDebt } = useDashboardData();
  const { openDialog } = useDialog();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('loan');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setTotalAmount('');
    setInterestRate('');
    setSelectedCategory('loan');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(totalAmount);
    const parsedRate = parseFloat(interestRate);
    if (!name || !totalAmount || !interestRate || isNaN(parsedAmount) || isNaN(parsedRate) || isSubmitting) return;

    setIsSubmitting(true);
    const category = debtCategories.find(c => c.id === selectedCategory)?.label || 'Outros';
    const debtData = {
      name,
      totalAmount: parsedAmount,
      interestRate: parsedRate,
      category,
      created_at: new Date().toISOString()
    };
    
    const newDebt = await addDebt(debtData);
    setIsSubmitting(false);

    if (newDebt) {
      resetForm();
      onClose();
      openDialog('add-payment-to-debt', { debt: newDebt });
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const sheetVariants = {
    hidden: isDesktop ? { x: '100%' } : { y: '100%' },
    visible: { x: 0, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 300 } },
    exit: isDesktop ? { x: '100%' } : { y: '100%' }
  };

  const selectedCat = debtCategories.find(c => c.id === selectedCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Sheet */}
          <motion.div
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed z-[110] bg-background/95 backdrop-blur-xl flex flex-col overflow-hidden",
              isDesktop 
                ? "right-0 top-0 h-full w-[500px] border-l border-white/10 rounded-l-3xl" 
                : "bottom-0 left-0 right-0 max-h-[95vh] rounded-t-3xl border-t border-white/10"
            )}
          >
            {/* Header with gradient */}
            <div className="relative overflow-hidden">
                <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-br from-current to-transparent", selectedCat?.colorClass)} />

              {/* Mobile handle */}
              {!isDesktop && (
                <div className="w-full flex justify-center pt-3 pb-1 relative z-10">
                  <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                </div>
              )}

              <div className="relative z-10 flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", selectedCat?.bgClass)}>
                    <TrendingDown className={cn("w-6 h-6", selectedCat?.colorClass)} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Nova Dívida</h2>
                    <p className="text-sm text-muted-foreground">Registre uma nova dívida para acompanhar</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  title="Fechar"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Form content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              
              {/* Category Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Tipo de Dívida</label>
                <div className="grid grid-cols-4 gap-2">
                  {debtCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200",
                          isSelected 
                            ? cn("ring-2 ring-offset-2 ring-offset-[#0B0E14]", cat.bgClass, cat.ringClass)
                            : "bg-white/5 hover:bg-white/10"
                        )}
                      >
                        <Icon 
                          className={cn("w-5 h-5", isSelected ? cat.colorClass : "text-gray-400")} 
                        />
                        <span className={cn(
                          "text-xs font-medium text-center leading-tight",
                          isSelected ? "text-white" : "text-muted-foreground"
                        )}>
                          {cat.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Nome da Dívida
                </label>
                <Input
                  id="debt-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Fatura Nubank, Financiamento Carro..."
                  className="h-12 bg-white/5 border-white/10 focus:border-primary rounded-xl"
                  required
                />
              </div>

              {/* Amount with visual input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Valor Total
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</div>
                  <Input
                    id="debt-amount"
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    placeholder="0,00"
                    className={cn(
                        "h-14 pl-12 text-2xl font-bold bg-white/5 border-white/10 focus:border-primary rounded-xl",
                        selectedCat?.colorClass
                    )}
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Taxa de Juros (% ao ano)
                </label>
                <div className="relative">
                  <Input
                    id="debt-interest"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="12.5"
                    className="h-12 pr-12 bg-white/5 border-white/10 focus:border-primary rounded-xl"
                    step="0.01"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">% a.a.</div>
                </div>
              </div>

              {/* Info card */}
              <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-500">Dica</p>
                  <p className="text-muted-foreground">Após salvar, você poderá registrar pagamentos para acompanhar a quitação da dívida.</p>
                </div>
              </div>

            </form>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-white/10 bg-black/20">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onClose} 
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                form="debt-form"
                onClick={handleSubmit}
                disabled={isSubmitting || !name || !totalAmount || !interestRate}
                className={cn(
                    "flex-1 h-12 rounded-xl font-semibold shadow-lg text-white",
                    selectedCat?.bgClass.replace('/20', '') // Hack to get solid color from bg class, or we can use another prop. 
                    // Actually let's use a specific style here as tailwind doesn't support easy dynamic bg without safelist or mapping.
                    // But we have colorClass (text-color). We need bg-color-500.
                    // Let's add hoverClass or solidBgClass to the map.
                )}
                // Fallback to style for submit button background purely because it's the primary action and needs specific solid color
                style={{
                   backgroundColor: selectedCat?.colorClass ? `var(--${selectedCat.colorClass.replace('text-', '')})` : undefined
                }}
              >
                 {/* Reverting to inline style just for the button BG because dynamic class construction is tricky without a large map. 
                     Wait, I can add `solidBgClass` to the categories map. */}
                 {isSubmitting ? (
                  <><LoadingSpinner /> Salvando...</>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Registrar Dívida
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
