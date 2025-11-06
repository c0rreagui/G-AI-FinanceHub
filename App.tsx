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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <AIHub />;
      case 'dashboard':
        return <DashboardView />;
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
        return <AIHub />;
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

export default App;