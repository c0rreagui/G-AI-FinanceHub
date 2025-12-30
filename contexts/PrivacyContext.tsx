import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShieldAlert } from 'lucide-react';

interface PrivacyContextType {
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  isPanicMode: boolean;
  togglePanicMode: () => void;
  playSound: (type: 'success' | 'error' | 'click') => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPrivacyMode, setIsPrivacyMode] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('financehub_privacy_mode') === 'true';
    }
    return false;
  });
  const [isPanicMode, setIsPanicMode] = useState(false);

  const togglePrivacyMode = () => {
    setIsPrivacyMode(prev => {
      const newValue = !prev;
      localStorage.setItem('financehub_privacy_mode', String(newValue));
      return newValue;
    });
  };

  const togglePanicMode = useCallback(() => {
      setIsPanicMode(prev => !prev);
  }, []);

  // Panic Button Listener (Double Escape)
  useEffect(() => {
      let lastPress = 0;
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
              const now = Date.now();
              if (now - lastPress < 300) {
                  togglePanicMode();
              }
              lastPress = now;
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePanicMode]);

  // Sound Feedback
  const playSound = useCallback((type: 'success' | 'error' | 'click') => {
      if (type === 'success') {
          console.log('🎵 Ding! Success!');
      }
  }, []);

  return (
    <PrivacyContext.Provider value={{ isPrivacyMode, togglePrivacyMode, isPanicMode, togglePanicMode, playSound }}>
      {isPanicMode ? (
          <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center cursor-pointer" onClick={togglePanicMode}>
              <div className="text-center">
                  <ShieldAlert className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                  <p className="text-gray-900 font-mono text-xs">System Locked. Double Esc to unlock.</p>
              </div>
          </div>
      ) : (
          children
      )}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};
