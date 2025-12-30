import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { PiggyBank, TrendingDown, Wallet, ArrowUpRight, Zap, User } from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface OnboardingViewProps {
  onComplete: (goalId: string | null) => void;
}

const goals = [
  { id: 'organize', icon: Wallet, title: 'Organizar meus gastos', description: 'Tenha uma visão clara de para onde seu dinheiro está indo.' },
  { id: 'save', icon: PiggyBank, title: 'Economizar para algo', description: 'Crie metas e acompanhe seu progresso para realizar seus sonhos.' },
  { id: 'debts', icon: TrendingDown, title: 'Sair das dívidas', description: 'Monitore e pague suas dívidas de forma estratégica.' },
  { id: 'invest', icon: ArrowUpRight, title: 'Começar a investir', description: 'Construa seu patrimônio e alcance a independência financeira.' },
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [userName, setUserName] = useState(user?.user_metadata?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);

  const handleFinalize = async () => {
    setIsUpdating(true);
    try {
      if (userName && userName !== user?.user_metadata?.name) {
        await supabase.auth.updateUser({
          data: { name: userName }
        });
      }
      onComplete(selectedGoal);
    } catch (error) {
      console.error('Erro ao salvar nome no onboarding:', error);
      onComplete(selectedGoal);
    } finally {
      setIsUpdating(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const stepVariants = {
    enter: { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        {...({ className: "w-full max-w-2xl" } as any)}
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              {...({ className: "text-center" } as any)}
            >
              <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                Bem-vindo ao FinanceHub
              </h1>
              <p className="mt-4 text-xl text-gray-300">Seu copiloto para uma vida financeira mais saudável.</p>
              <p className="mt-2 text-gray-400">Vamos começar a organizar suas finanças em poucos passos.</p>
              <Button onClick={handleNext} className="mt-8">
                Vamos Começar <ArrowUpRight className="w-4 h-4" />
              </Button>
              <div className="mt-4">
                <button
                  onClick={() => onComplete(null)}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Pular por agora
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              {...({ className: "text-center" } as any)}
            >
              <h2 className="text-3xl font-bold text-white">Qual seu principal objetivo financeiro hoje?</h2>
              <p className="mt-2 text-gray-400">Isso nos ajuda a personalizar sua experiência.</p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goals.map(goal => (
                  <motion.button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    {...({ className: `p-6 rounded-2xl text-left border-2 transition-all duration-200 ${selectedGoal === goal.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-[oklch(var(--border-oklch))] bg-[oklch(var(--card-oklch))] hover:bg-[oklch(var(--border-oklch))]'}` } as any)}
                    whileHover={{ y: -4 }}
                    animate={selectedGoal === goal.id ? { scale: 1.05, y: -5 } : { scale: 1, y: 0 }}
                  >
                    <goal.icon className="w-8 h-8 text-cyan-300 mb-2" />
                    <h3 className="font-semibold text-white">{goal.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{goal.description}</p>
                  </motion.button>
                ))}
              </div>
              <Button onClick={handleNext} disabled={!selectedGoal} className="mt-8">
                Continuar
              </Button>
              <div className="mt-4">
                <button
                  onClick={() => onComplete(null)}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Pular
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              {...({ className: "text-center space-y-6" } as any)}
            >
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-white">Como podemos te chamar?</h2>
              <p className="text-gray-400">Personalize seu perfil para uma experiência única.</p>

              <div className="max-w-xs mx-auto space-y-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-center text-lg"
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-3 max-w-xs mx-auto pt-4">
                <Button onClick={handleNext} disabled={!userName.trim()}>
                  Tudo Certo!
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              {...({ className: "text-center" } as any)}
            >
              <Zap className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white">Tudo pronto, {userName.split(' ')[0]}!</h2>
              <p className="mt-2 text-gray-300 max-w-md mx-auto">Sua jornada para o controle financeiro começa agora. Explore o dashboard, adicione suas transações e alcance seus objetivos.</p>
              <Button onClick={handleFinalize} className="mt-8" disabled={isUpdating}>
                {isUpdating ? 'Salvando...' : 'Ir para o Dashboard'}
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
};