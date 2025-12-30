import React from 'react';
import { Sidebar } from './Sidebar';
import { ViewType } from '../../types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MobileBottomNav } from './MobileBottomNav';
import { DialogManager } from '../DialogManager';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ErrorModal } from '../ui/ErrorModal';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { AuroraBackground } from '../ui/AuroraBackground';


interface AppLayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, currentView, setCurrentView }) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { error, clearError } = useDashboardData();
  const { isGuest } = useAuth();
  const { wallpaper } = useTheme();
  // Direct children rendering without cloning
  // Notification logic moved to DialogManager and PageHeader

  return (
    <>
      {/* Wallpaper Layer */}
      {wallpaper ? (
          <div className="fixed inset-0 z-[-1]">
              <div className="absolute inset-0 bg-black/60 z-10" /> 
              <img src={wallpaper} alt="Background" className="w-full h-full object-cover" />
          </div>
      ) : (
        <AuroraBackground />
      )}

      <div className={`flex h-screen w-screen bg-transparent text-foreground overflow-hidden relative z-10 ${isGuest ? 'flex-col' : ''}`}>
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Pular para o conteúdo principal
        </a>
        
        {isDesktop && <Sidebar currentView={currentView} setCurrentView={setCurrentView} />}
        
        <main id="main-content" className={`flex-1 flex flex-col overflow-hidden ${!isDesktop ? 'pb-20' : ''}`}>
          <div className="p-4 sm:p-6 lg:p-8 flex-grow flex flex-col h-full overflow-y-auto custom-scrollbar">
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