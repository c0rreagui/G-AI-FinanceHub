import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ViewType } from './types';
import { AIHub } from './components/AIHub';
import { DashboardView } from './components/views/DashboardView';
import { TransactionsView } from './components/views/TransactionsView';
import { InsightsView } from './components/views/InsightsView';
import { GoalsView } from './components/views/GoalsView';
import { DebtsView } from './components/views/DebtsView';
import { SchedulingView } from './components/views/SchedulingView';
import { ToolsView } from './components/views/ToolsView';
import { DialogProvider } from './contexts/DialogContext';
import { DashboardDataProvider } from './hooks/useDashboardData';
import { SettingsView } from './components/views/SettingsView';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthView } from './components/views/AuthView';
import { LoadingSpinner } from './components/LoadingSpinner';

// Componente principal que decide o que mostrar
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const { session, loading } = useAuth();

  if (loading) {
    // Mostra um loading enquanto verifica se o usuário está logado
    return (
      <div className="flex h-screen items-center justify-center bg-oklch-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    // Se NÃO há sessão, mostra a tela de Login
    return <AuthView />;
  }

  // Se HÁ sessão, mostra o app principal
  const renderView = () => {
    switch (currentView) {
      case 'home': return <AIHub />;
      case 'dashboard': return <DashboardView />;
      case 'transactions': return <TransactionsView />;
      case 'insights': return <InsightsView />;
      case 'goals': return <GoalsView />;
      case 'debts': return <DebtsView />;
      case 'scheduling': return <SchedulingView />;
      case 'tools': return <ToolsView />;
      case 'settings': return <SettingsView />;
      default: return <AIHub />;
    }
  };

  return (
    <DashboardDataProvider>
      <DialogProvider>
        <AppLayout currentView={currentView} setCurrentView={setCurrentView}>
          {renderView()}
        </AppLayout>
      </DialogProvider>
    </DashboardDataProvider>
  );
};

// O App.tsx agora só envolve o AppContent com o AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
