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

  return (
    <>
      {/* Wallpaper Layer */}
      {wallpaper && (
          <div className="fixed inset-0 z-[-1]">
              <div className="absolute inset-0 bg-black/60 z-10" /> {/* Overlay for readability */}
              <img src={wallpaper} alt="Background" className="w-full h-full object-cover" />
          </div>
      )}

      <div className={`flex h-screen w-screen bg-transparent text-oklch-foreground overflow-hidden ${isGuest ? 'flex-col' : ''}`}>
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