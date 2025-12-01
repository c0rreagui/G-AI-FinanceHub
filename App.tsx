import React, { useState, useCallback } from 'react';
import { AuthView } from './components/views/AuthView';
import { AppLayout } from './components/layout/AppLayout';
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
import { AnimatePresence, motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ui/ToastContainer';
import { DesignSystemView } from './components/views/DesignSystemView';
import { OnboardingView } from './components/views/OnboardingView';
import { GuestModeBanner } from '@/components/GuestModeBanner';
import { logger } from './services/loggingService';
import { APP_VERSION, APP_CODENAME } from './config';
import { DevToolsView } from './components/views/DevToolsView';
import { PrivacyProvider } from './contexts/PrivacyContext';
import { useAuth, AuthProvider } from './hooks/useAuth';
import { useDialog } from './hooks/useDialog';
import { useToast } from './hooks/useToast';
import { DashboardDataProvider } from './hooks/useDashboardData';
import { DialogProvider } from './contexts/DialogContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SocialProvider } from './contexts/SocialContext';
import { SocialView } from './components/views/SocialView';
import { InvestmentsView } from './components/views/InvestmentsView';

const AppContent: React.FC = () => {
  const { user, loading, isGuest, isDeveloper } = useAuth();
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

  const renderView = useCallback(() => {
    const pageVariants = {
      initial: { opacity: 0, y: 15 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -15 },
    };
    const pageTransition: Transition = {
      type: 'tween',
      ease: [0.4, 0, 0.2, 1], // Curva de ease customizada para suavidade
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
        viewComponent = <DevToolsView setCurrentView={setCurrentView} />;
        break;
      case 'design-system':
        viewComponent = <DesignSystemView />;
        break;
      case 'social':
        viewComponent = <SocialView />;
        break;
      case 'investments':
        viewComponent = <InvestmentsView />;
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
        {...({ className: "flex flex-col flex-grow h-full" } as any)}
      >
        {viewComponent}
      </motion.div>
    );
  }, [currentView]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user && !isGuest && !isDeveloper) {
    return <AuthView />;
  }

  if (!onboardingComplete && !isGuest && !isDeveloper) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <AppLayout currentView={currentView} setCurrentView={setCurrentView}>
      <AnimatePresence mode="wait">
        {renderView()}
      </AnimatePresence>
      <GuestModeBanner />
      <ToastContainer />
    </AppLayout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <DashboardDataProvider>
          <PrivacyProvider>
            <ThemeProvider>
              <SocialProvider>
                <DialogProvider>
                <ErrorBoundary>
                    <AppContent />
                </ErrorBoundary>
                </DialogProvider>
              </SocialProvider>
            </ThemeProvider>
          </PrivacyProvider>
        </DashboardDataProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;