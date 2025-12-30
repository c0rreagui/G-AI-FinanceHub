import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';
import { ViewType } from '../../types';

const TypingEffect: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); // Reset on text change
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 30); // Faster typing
        return () => clearInterval(timer);
    }, [text]);

    return <span>{displayedText}</span>;
};

interface GreetingHeaderProps {
    user: any;
    setCurrentView?: (view: ViewType) => void;
    onNotificationClick?: () => void;
    unreadCount?: number;
}

import { useDialog } from '../../hooks/useDialog';
import { useNotifications } from '../../contexts/NotificationContext';
import { useTheme } from '../../contexts/ThemeContext';

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({ user, setCurrentView, onNotificationClick, unreadCount: propUnreadCount }) => {
    const { greetingName, setGreetingName } = useTheme();
    const { openDialog } = useDialog();
    const { unreadCount: contextUnreadCount } = useNotifications();
    const unreadCount = propUnreadCount ?? contextUnreadCount;

    const [greeting, setGreeting] = useState('');
    const [icon, setIcon] = useState<React.ReactNode>(null);
    const today = new Date();
    const dateStr = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    const [tempName, setTempName] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Bom dia');
            setIcon(<Sun className="w-6 h-6 text-yellow-400 animate-spin-slow" />);
        } else if (hour < 18) {
            setGreeting('Boa tarde');
            setIcon(<Sun className="w-6 h-6 text-orange-400" />);
        } else {
            setGreeting('Boa noite');
            setIcon(<Moon className="w-6 h-6 text-indigo-400" />);
        }
    }, []);

    const handleNotificationClick = () => {
        if (onNotificationClick) {
            onNotificationClick();
        } else {
            openDialog('notifications');
        }
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px] group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                            <span className="text-sm font-bold text-white">
                                {user?.name?.charAt(0) || 'D'}
                            </span>
                        </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                </div>
                <div>
                    {greeting}, {greetingName ? (
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{greetingName}</span>
                    ) : (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Seu nome"
                                value={tempName}
                                onChange={e => setTempName(e.target.value)}
                                className="bg-white/10 text-white rounded px-2 py-1 focus:outline-none"
                            />
                            <button
                                onClick={() => {
                                    if (tempName.trim()) {
                                        setGreetingName(tempName.trim());
                                        setTempName('');
                                    }
                                }}
                                className="bg-primary text-white rounded px-2 py-1"
                            >
                                Salvar
                            </button>
                        </div>
                    )} {icon}
                    <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                        <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            {dateStr}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                data-testid="notification-bell"
                                variant="ghost"
                                size="icon"
                                aria-label="Notificações"
                                className="relative text-muted-foreground hover:text-foreground"
                                onClick={handleNotificationClick}
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <>
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-ping" />
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
                                    </>
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Notificações</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Configurações"
                                className="text-muted-foreground hover:text-foreground hover:rotate-90 transition-transform duration-500"
                                onClick={() => setCurrentView?.('settings')}
                            >
                                <Settings className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Configurações</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};
