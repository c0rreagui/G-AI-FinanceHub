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

      <div className={`flex h-screen w-screen bg-transparent text-foreground overflow-hidden ${isGuest ? 'flex-col' : ''}`}>
        {isDesktop && <Sidebar currentView={currentView} setCurrentView={setCurrentView} />}
        
        <main className={`flex-1 flex flex-col overflow-hidden ${!isDesktop ? 'pb-20' : ''}`}>
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