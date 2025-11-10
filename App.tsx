import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { DashboardDataProvider } from './hooks/useDashboardData';
import { DialogProvider } from './contexts/DialogContext';
import { ToastProvider } from './contexts/ToastContext';
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
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ui/ToastContainer';
import { APP_VERSION } from './config';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-oklch-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }
  
  const renderView = () => {
    const pageVariants = {
      initial: { opacity: 0, y: 20 },
      in: { opacity: 1, y: 0 },
      out: { opacity: 0, y: -20 },
    };
    const pageTransition = {
      type: 'tween',
      ease: 'anticipate',
      duration: 0.4,
    };
    
    let viewComponent;
    switch (currentView) {
      case 'home':
        viewComponent = <HomeDashboardView />;
        break;
      case 'transactions':
        viewComponent = <TransactionsView />;
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
        viewComponent = <ToolsView />;
        break;
      case 'settings':
        viewComponent = <SettingsView />;
        break;
      default:
        viewComponent = <HomeDashboardView />;
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
  };

  return (
    <>
      <AppLayout currentView={currentView} setCurrentView={setCurrentView}>
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </AppLayout>
      <div className="fixed bottom-1 right-2 text-xs text-white/20 pointer-events-none select-none">
        v{APP_VERSION}
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <DashboardDataProvider>
          <DialogProvider>
            <ErrorBoundary>
              <AppContent />
              <ToastContainer />
            </ErrorBoundary>
          </DialogProvider>
        </DashboardDataProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;