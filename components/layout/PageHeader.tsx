import React, { useState, useEffect } from 'react';
import { ChevronDown, Bell, Search, User, LogOut, Settings, Command } from 'lucide-react';
import { PrivacyToggle } from '../ui/PrivacyMask';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { useDialog } from '../../hooks/useDialog';
import { useNotifications } from '../../contexts/NotificationContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';
import { MicrophoneButton } from '../ui/MicrophoneButton';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { FamilySwitcher } from '../dashboard/FamilySwitcher';

interface PageHeaderProps {
    icon: React.ElementType | React.ReactNode;
    title: string;
    subtitle?: string;
    breadcrumbs?: string[];
    actions?: React.ReactNode;
    children?: React.ReactNode;
    unreadCount?: number;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, breadcrumbs = [], actions, children, unreadCount: propUnreadCount }) => {
    const { user, logout, isDeveloper } = useAuth();
    const { openDialog } = useDialog();
    const { unreadCount: contextUnreadCount } = useNotifications();
    const { greetingName } = useTheme();
    const [greeting, setGreeting] = useState({ text: 'Bem-vindo', icon: '👋' });

    const unreadCount = propUnreadCount ?? contextUnreadCount;

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) setGreeting({ text: 'Bom dia', icon: '☀️' });
            else if (hour >= 12 && hour < 18) setGreeting({ text: 'Boa tarde', icon: '🌤️' });
            else setGreeting({ text: 'Boa noite', icon: '🌙' });
        };
        updateGreeting();
        const interval = setInterval(updateGreeting, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);



    const renderIcon = () => {
        if (React.isValidElement(icon)) {
            return icon;
        }
        const Icon = icon as React.ElementType;
        return <Icon className="w-8 h-8 text-cyan-300" />;
    };

    const getDisplayName = () => {
        if (greetingName) return greetingName;
        if (user?.user_metadata?.name) return user.user_metadata.name;
        if (isDeveloper) return 'Desenvolvedor';
        return 'Visitante';
    };

    return (
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl transition-all duration-300 relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4 mb-4 flex-shrink-0 pt-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
            <div
                className="absolute bottom-[-1px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent [animation:pulse-border_3s_ease-in-out_infinite]"
            />
            <div>
                <div className="flex items-center gap-3">
                    <FamilySwitcher />
                    {renderIcon()}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span>{greeting.icon} {greeting.text}, <span className="text-primary font-medium">{getDisplayName()}</span></span>
                        </p>
                    </div>
                </div>
                {breadcrumbs.length > 0 && (
                    <div className="mt-2 flex items-center gap-x-2 text-sm text-muted-foreground">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb}>
                                <span>{crumb}</span>
                                {index < breadcrumbs.length - 1 && (
                                    <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
            {children}

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 flex-wrap justify-end">
                <MicrophoneButton
                    className="mr-2 hidden sm:flex"
                    size="sm"
                    onRecordingStop={() => { }}
                />
                <button className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 border border-white/10 hover:border-primary/20 overflow-visible group [&_svg]:stroke-[1.5]">
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute -bottom-2 -right-2 bg-black/80 backdrop-blur text-[10px] px-1.5 rounded border border-white/10 text-muted-foreground flex items-center gap-0.5 shadow-sm z-10">
                        <Command className="w-2 h-2" />K
                    </span>
                </button>

                <button
                    data-testid="notification-bell"
                    onClick={() => {
                        openDialog('notifications');
                    }}
                    title="Notificações"
                    className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-all duration-300 border border-white/10 hover:border-primary/20 [&_svg]:stroke-[1.5]"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    )}
                </button>

                <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

                <PrivacyToggle />

                {actions}

                <Popover>
                    <PopoverTrigger asChild>
                        <button className="relative outline-none">
                            <Avatar className="w-10 h-10 border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                                <AvatarImage src={user?.user_metadata?.avatar_url} />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-primary-foreground font-bold">
                                    {user?.user_metadata?.name?.substring(0, 2).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 bg-popover backdrop-blur-xl border-border" align="end">
                        <div className="flex flex-col gap-1">
                            <div className="px-2 py-1.5 text-sm font-medium text-foreground border-b border-border mb-1">
                                {user?.email || 'visitante@financehub.com'}
                            </div>
                            <button className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                                <User className="w-4 h-4" /> Perfil
                            </button>
                            <button className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors w-full text-left">
                                <Settings className="w-4 h-4" /> Configurações
                            </button>
                            <div className="h-px bg-border my-1" />
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-2 py-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors w-full text-left"
                            >
                                <LogOut className="w-4 h-4" /> Sair
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};