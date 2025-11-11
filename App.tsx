import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
// FIX: Corrected import path.
import { DashboardDataProvider } from './hooks/useDashboardData';
import { DialogProvider } from './contexts/DialogContext';
import { useDialog } from './hooks/useDialog';
import { ToastProvider } from './contexts/ToastContext';
import { useToast } from './hooks/useToast';
// FIX: Corrected import path.
import { AuthView } from './components/views/AuthView';
import { AppLayout } from './components/layout/AppLayout';
// FIX: Corrected import path.
import { ViewType } from './types';
import { TransactionsView } from './components/views/TransactionsView';
import { InsightsView } from './components/views/InsightsView';
import { GoalsView } from './components/views/GoalsView';
import { DebtsView } from './components/views/DebtsView';
import { SchedulingView } from './components/views/SchedulingView';
import { ToolsView } from './components/views/ToolsView';
import { SettingsView } from './components/views/SettingsView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { HomeDashboardView } from './components/views/HomeDashboardView';
import { AnimatePresence, motion, Transition } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ui/ToastContainer';
// FIX: Corrected import path.
import { APP_VERSION, APP_CODENAME } from './config';
import { OnboardingView } from './components/views/OnboardingView';
import { logger } from './services/loggingService';
// FIX: Corrected import path.
import { DevToolsView } from './components/views/DevToolsView';

const GuestModeBanner: React.FC = () => {
    const { logout } = useAuth();
    return (
        <div className="bg-yellow-500/20 text-yellow-200 text-center text-sm py-2 px-4 border-b border-yellow-500/30 flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
            <span>Você está no modo visitante. Seus dados são salvos localmente.</span>
            <button onClick={logout} className="font-bold underline hover:text-white">
                Crie uma conta
            </button>
            <span>para salvar seus dados na nuvem.</span>
        </div>
    );
};

const AppContent: React.FC = () => {
  const { user, loading, isGuest } = useAuth();
  const { openDialog } = useDialog();
  const { showToast } = useToast();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(() => {
    try {
        if (sessionStorage.getItem('guest_mode') === 'true') return true; // Guests skip onboarding
        return localStorage.getItem('financehub_onboarded') === 'true';
    } catch (error) {
        logger.warn("Não foi possível acessar o localStorage para o status de onboarding.", { error });
        return false;
    }
  });


  const handleOnboardingComplete = (goalId: string | null) => {
    try {
        localStorage.setItem('financehub_onboarded', 'true');
    } catch (error) {
        logger.warn("Não foi possível salvar o status de onboarding no localStorage.", { error });
    }
    setOnboardingComplete(true);
    showToast('Tudo pronto!', { description: 'Bem-vindo ao seu novo dashboard!', type: 'success' });

    // Abre o modal relevante com base na escolha do usuário no onboarding
    switch (goalId) {
        case 'save':
            openDialog('add-goal');
            break;
        case 'debts':
            openDialog('add-debt');
            break;
        case 'organize':
        case 'invest':
            // Para 'organizar' e 'investir', abrir o modal de transação é um bom ponto de partida.
            openDialog('add-transaction');
            break;
        default:
            // Não faz nada se nenhum objetivo foi selecionado
            break;
    }
  };

  // FIX: Moved `useCallback` before conditional returns to adhere to the Rules of Hooks.
  const renderView = useCallback(() => {
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 },
    };
    const pageTransition: Transition = {
      type: 'tween',
      ease: 'anticipate',
      duration: 0.4,
    };
    
    let viewComponent;
    switch (currentView) {
      case 'home':
        viewComponent = <HomeDashboardView setCurrentView={setCurrentView} />;
        break;
      case 'transactions':
        viewComponent = <TransactionsView setCurrentView={setCurrentView} />;
        break;
      case 'insights':
        viewComponent = <InsightsView />;
        break;
      case 'goals':
        viewComponent = <GoalsView />;
        break;
      case 'debts':
        viewComponent = <DebtsView />;
        break;
      case 'scheduling':
        viewComponent = <SchedulingView />;
        break;
      case 'tools':
        viewComponent = <ToolsView setCurrentView={setCurrentView} />;
        break;
      case 'settings':
        viewComponent = <SettingsView />;
        break;
      case 'devtools':
        viewComponent = <DevToolsView />;
        break;
      default:
        viewComponent = <HomeDashboardView setCurrentView={setCurrentView} />;
        break;
    }
    
    return (
      <motion.div
        key={currentView}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex flex-col flex-grow h-full"
      >
        {viewComponent}
      </motion.div>
    );
  }, [currentView]);


  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-oklch-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user && !isGuest) {
    return <AuthView />;
  }
  
  if (!onboardingComplete && !isGuest) {
      return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      {isGuest && <GuestModeBanner />}
      <AppLayout currentView={currentView} setCurrentView={setCurrentView}>
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </AppLayout>
      <div className="fixed bottom-1 right-2 text-xs text-white/20 pointer-events-none select-none">
        v{APP_VERSION} ({APP_CODENAME})
      </div>
    </>
  );
};

// Envolve AppContent com DialogProvider para que `useDialog` funcione
const AppWithDialog: React.FC = () => (
    <DialogProvider>
        <AppContent />
        <ToastContainer />
    </DialogProvider>
);


const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <DashboardDataProvider>
            <ErrorBoundary>
              <AppWithDialog />
            </ErrorBoundary>
        </DashboardDataProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;