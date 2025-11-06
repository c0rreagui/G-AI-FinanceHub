import React from 'react';
import { Sidebar } from './Sidebar';
import { ViewType } from '../../types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MobileBottomNav } from './MobileBottomNav';
import { DialogManager } from '../DialogManager';
import { useDashboardData } from '../../hooks/useDashboardData';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => (
  <div className="flex-grow flex items-center justify-center p-4">
    <div className="bg-red-900/50 border border-red-500/30 text-red-200 rounded-2xl p-6 max-w-2xl mx-auto w-full">
      <h2 className="text-xl font-bold mb-2 text-white">Erro de Conexão</h2>
      <p className="mb-4 text-red-200">Não foi possível carregar os dados do Supabase.</p>
      <pre className="bg-black/30 p-4 rounded-md text-xs whitespace-pre-wrap font-mono">
        <code>{error}</code>
      </pre>
    </div>
  </div>
);

export const AppLayout: React.FC<AppLayoutProps> = ({ children, currentView, setCurrentView }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { error } = useDashboardData();

  return (
    <>
      <div className="flex h-screen bg-oklch-background text-oklch-foreground overflow-hidden">
        {isDesktop && <Sidebar currentView={currentView} setCurrentView={setCurrentView} />}
        
        <main className={`flex-1 flex flex-col overflow-y-auto ${!isDesktop ? 'pb-16' : ''}`}>
          <div className="p-4 sm:p-6 lg:p-8 flex-grow flex flex-col">
              {error ? <ErrorDisplay error={error} /> : children}
          </div>
        </main>

        {!isDesktop && <MobileBottomNav currentView={currentView} setCurrentView={setCurrentView} />}
      </div>
      <DialogManager />
    </>
  );
};