import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';
import { usePrivacy } from '../../contexts/PrivacyContext';

// Re-export PrivacyProvider from context to avoid breaking imports in App.tsx temporarily
// (Though we will update App.tsx next)
export { PrivacyProvider } from '../../contexts/PrivacyContext';

export const PrivacyToggle: React.FC<{ className?: string }> = ({ className }) => {
    const { isPrivacyMode, togglePrivacyMode } = usePrivacy();
    
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={togglePrivacyMode} aria-label={isPrivacyMode ? 'Mostrar valores' : 'Ocultar valores'} className={cn("text-muted-foreground hover:text-foreground", className)}>
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
