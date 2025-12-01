import React, { useState, useEffect } from 'react';
import { Sun, Moon, CloudRain, Bell, Settings } from 'lucide-react';
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
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({ user, setCurrentView }) => {
    const [greeting, setGreeting] = useState('');
    const [icon, setIcon] = useState<React.ReactNode>(null);
    const today = new Date();
    const dateStr = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

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

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px] group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                             <span className="text-xl font-bold text-white">
                                {user?.name?.charAt(0) || 'D'}
                             </span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full"></div>
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                        <TypingEffect text={`${greeting}, ${user?.name || 'Dev'}!`} /> {icon}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                         <span className="capitalize">{dateStr}</span>
                         <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                         <span className="flex items-center gap-1">
                            <CloudRain className="w-3 h-3 text-blue-400" /> 24°C
                         </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="relative text-gray-400 hover:text-white"
                                onClick={() => {
                                    // TODO: Implement notifications panel
                                    console.log('Abrindo notificações...');
                                }}
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
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
                                className="text-gray-400 hover:text-white hover:rotate-90 transition-transform duration-500"
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
