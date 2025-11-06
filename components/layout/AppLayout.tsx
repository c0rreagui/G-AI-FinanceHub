import React from 'react';
import { Sidebar } from './Sidebar';
import { ViewType } from '../../types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MobileBottomNav } from './MobileBottomNav';
import { DialogManager } from '../DialogManager';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, currentView, setCurrentView }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <>
      <div className="flex h-screen bg-oklch-background text-oklch-foreground overflow-hidden">
        {isDesktop && <Sidebar currentView={currentView} setCurrentView={setCurrentView} />}
        
        <main className={`flex-1 flex flex-col overflow-y-auto ${!isDesktop ? 'pb-16' : ''}`}>
          <div className="p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
              {children}
          </div>
        </main>

        {!isDesktop && <MobileBottomNav currentView={currentView} setCurrentView={setCurrentView} />}
      </div>
      <DialogManager />
    </>
  );
};