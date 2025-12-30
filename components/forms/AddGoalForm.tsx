import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../LoadingSpinner';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, DollarSign, Calendar, Sparkles, Car, Home, Plane, GraduationCap, Heart, Gift, Smartphone, Briefcase, Trophy } from 'lucide-react';
import { useDialog } from '../../hooks/useDialog';
import { cn } from '@/utils/utils';

interface AddGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// Goal type categories with icons and Tailwind classes
const goalCategories = [
  { id: 'savings', label: 'Reserva', icon: Briefcase, colorClass: 'text-cyan-500', bgClass: 'bg-cyan-500/20', ringClass: 'ring-cyan-500' },
  { id: 'car', label: 'Veículo', icon: Car, colorClass: 'text-blue-500', bgClass: 'bg-blue-500/20', ringClass: 'ring-blue-500' },
  { id: 'house', label: 'Imóvel', icon: Home, colorClass: 'text-violet-500', bgClass: 'bg-violet-500/20', ringClass: 'ring-violet-500' },
  { id: 'travel', label: 'Viagem', icon: Plane, colorClass: 'text-teal-500', bgClass: 'bg-teal-500/20', ringClass: 'ring-teal-500' },
  { id: 'education', label: 'Educação', icon: GraduationCap, colorClass: 'text-amber-500', bgClass: 'bg-amber-500/20', ringClass: 'ring-amber-500' },
  { id: 'health', label: 'Saúde', icon: Heart, colorClass: 'text-rose-500', bgClass: 'bg-rose-500/20', ringClass: 'ring-rose-500' },
  { id: 'gift', label: 'Presente', icon: Gift, colorClass: 'text-pink-500', bgClass: 'bg-pink-500/20', ringClass: 'ring-pink-500' },
  { id: 'tech', label: 'Tecnologia', icon: Smartphone, colorClass: 'text-indigo-500', bgClass: 'bg-indigo-500/20', ringClass: 'ring-indigo-500' },
];

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ isOpen, onClose }) => {
  const { addGoal } = useDashboardData();
  const { openDialog } = useDialog();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('savings');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setTargetAmount('');
    setDeadline('');
    setSelectedCategory('savings');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number.parseFloat(targetAmount);
    if (!name || !targetAmount || !deadline || Number.isNaN(parsedAmount) || isSubmitting) return;

    setIsSubmitting(true);

    const [year, month, day] = deadline.split('-').map(Number);
    const utcDeadline = new Date(Date.UTC(year, month - 1, day));
    
    const goalData = {
      name,
      targetAmount: parsedAmount,
      deadline: utcDeadline.toISOString(),
      created_at: new Date().toISOString()
    };

    const newGoal = await addGoal(goalData);
    setIsSubmitting(false);

    if (newGoal) {
      resetForm();
      onClose();
      openDialog('add-value-to-goal', { goal: newGoal });
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

  const selectedCat = goalCategories.find(c => c.id === selectedCategory);

  // Calculate days until deadline
  const getDaysUntil = () => {
    if (!deadline) return null;
    const target = new Date(deadline);
    const today = new Date();
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysUntil = getDaysUntil();

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
                    <Target className={cn("w-6 h-6", selectedCat?.colorClass)} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Nova Meta</h2>
                    <p className="text-sm text-muted-foreground">Defina seu próximo objetivo financeiro</p>
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
                <label className="text-sm font-medium text-muted-foreground">Tipo de Meta</label>
                <div className="grid grid-cols-4 gap-2">
                  {goalCategories.map((cat) => {
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
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Nome da Meta
                </label>
                <Input
                  id="goal-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Viagem para Europa, Carro novo..."
                  className="h-12 bg-white/5 border-white/10 focus:border-primary rounded-xl"
                  required
                />
              </div>

              {/* Amount with visual input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Valor Alvo
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</div>
                  <Input
                    id="goal-amount"
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
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

              {/* Deadline */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Prazo Final
                </label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="h-12 bg-white/5 border-white/10 focus:border-primary rounded-xl"
                  required
                />
                {daysUntil !== null && daysUntil > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Faltam <span className={cn("font-semibold", selectedCat?.colorClass)}>{daysUntil} dias</span> para atingir sua meta
                  </p>
                )}
              </div>

              {/* Motivation card */}
              <div className={cn("flex items-start gap-3 p-4 rounded-xl border", selectedCat?.bgClass, selectedCat?.colorClass.replace('text-', 'border-').replace('500', '500/30'))}>
                <Trophy className={cn("w-5 h-5 flex-shrink-0 mt-0.5", selectedCat?.colorClass)} />
                <div className="text-sm">
                  <p className={cn("font-medium", selectedCat?.colorClass)}>Continue focado!</p>
                  <p className="text-muted-foreground">Metas bem definidas aumentam suas chances de sucesso em 42%.</p>
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
                onClick={handleSubmit}
                disabled={isSubmitting || !name || !targetAmount || !deadline}
                className={cn(
                    "flex-1 h-12 rounded-xl font-semibold shadow-lg text-white",
                )}
                style={{
                   backgroundColor: selectedCat?.colorClass ? `var(--${selectedCat.colorClass.replace('text-', '')})` : undefined
                }}
              >
                  {isSubmitting ? (
                  <><LoadingSpinner /> Salvando...</>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Criar Meta
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
