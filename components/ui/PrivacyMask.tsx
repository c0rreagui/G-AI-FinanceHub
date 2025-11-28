import React, { createContext, useContext, useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

interface PrivacyContextType {
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPrivacyMode, setIsPrivacyMode] = useState(() => {
    return localStorage.getItem('financehub_privacy_mode') === 'true';
  });

  const togglePrivacyMode = () => {
    setIsPrivacyMode(prev => {
      const newValue = !prev;
      localStorage.setItem('financehub_privacy_mode', String(newValue));
      return newValue;
    });
  };

  return (
    <PrivacyContext.Provider value={{ isPrivacyMode, togglePrivacyMode }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export const PrivacyToggle: React.FC<{ className?: string }> = ({ className }) => {
    const { isPrivacyMode, togglePrivacyMode } = usePrivacy();
    
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={togglePrivacyMode} className={cn("text-muted-foreground hover:text-foreground", className)}>
                        {isPrivacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isPrivacyMode ? 'Mostrar valores' : 'Ocultar valores'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export const PrivacyMask: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    const { isPrivacyMode } = usePrivacy();

    if (!isPrivacyMode) return <>{children}</>;

    return (
        <span className={cn("blur-sm select-none transition-all duration-300", className)}>
            {children}
        </span>
    );
};
