import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { DashboardDataProvider } from './hooks/useDashboardData';
import { DialogProvider } from './contexts/DialogContext';
import { AuthView } from './components/views/AuthView';
import { AppLayout } from './components/layout/AppLayout';
import { ViewType } from './types';
import { HomeDashboardView } from './components/views/HomeDashboardView';
import { TransactionsView } from './components/views/TransactionsView';
import { InsightsView } from './components/views/InsightsView';
import { GoalsView } from './components/views/GoalsView';
import { DebtsView } from './components/views/DebtsView';
import { SchedulingView } from './components/views/SchedulingView';
import { ToolsView } from './components/views/ToolsView';
import { SettingsView } from './components/views/SettingsView';
import { LoadingSpinner } from './components/LoadingSpinner';

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
    switch (currentView) {
      case 'home':
        return <HomeDashboardView />;
      case 'transactions':
        return <TransactionsView />;
      case 'insights':
        return <InsightsView />;
      case 'goals':
        return <GoalsView />;
      case 'debts':
        return <DebtsView />;
      case 'scheduling':
        return <SchedulingView />;
      case 'tools':
        return <ToolsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeDashboardView />;
    }
  };

  return (
    <>
      <AppLayout currentView={currentView} setCurrentView={setCurrentView}>
        {renderView()}
      </AppLayout>
      <div className="fixed bottom-1 right-2 text-xs text-white/20 pointer-events-none select-none">
        v2.0.23
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DashboardDataProvider>
        <DialogProvider>
          <AppContent />
        </DialogProvider>
      </DashboardDataProvider>
    </AuthProvider>
  );
};

export default App;