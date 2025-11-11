import React from 'react';
import { Sidebar } from './Sidebar';
import { ViewType } from '../../types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MobileBottomNav } from './MobileBottomNav';
import { DialogManager } from '../DialogManager';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ErrorModal } from '../ui/ErrorModal';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, currentView, setCurrentView }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { error, clearError } = useDashboardData();

  return (
    <>
      <div className="flex h-screen w-screen bg-transparent text-oklch-foreground overflow-hidden">
        {isDesktop && <Sidebar currentView={currentView} setCurrentView={setCurrentView} />}
        
        <main className={`flex-1 flex flex-col overflow-hidden ${!isDesktop ? 'pb-20' : ''}`}>
          <div className="p-4 sm:p-6 lg:p-8 flex-grow flex flex-col h-full max-h-screen">
              {children}
          </div>
        </main>

        {!isDesktop && <MobileBottomNav currentView={currentView} setCurrentView={setCurrentView} />}
      </div>
      <DialogManager />
      <ErrorModal isOpen={!!error} error={error} onClose={clearError} />
    </>
  );
};