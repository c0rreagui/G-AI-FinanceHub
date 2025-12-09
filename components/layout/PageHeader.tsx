import React, { useState, useEffect } from 'react';
import { ChevronDown, Bell, Search, User, LogOut, Settings, Command } from 'lucide-react';
import { PrivacyToggle } from '../ui/PrivacyMask';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  icon: React.ElementType | React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs?: string[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, breadcrumbs = [], actions }) => {
  const { user, logout, isDeveloper } = useAuth();
  const { greetingName } = useTheme();
  const [greeting, setGreeting] = useState({ text: 'Bem-vindo', icon: '👋' });

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
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md transition-all duration-300 relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5 mb-6 flex-shrink-0 pt-4 -mx-6 px-6">
      <div 
        className="absolute bottom-[-1px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent [animation:pulse-border_3s_ease-in-out_infinite]"
      />
      <div>
        <div className="flex items-center gap-3">
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
      
      <div className="flex items-center gap-3 flex-shrink-0">
         <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button className="relative w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border overflow-visible">
                        <Search className="w-5 h-5" />
                        <span className="absolute -bottom-2 -right-2 bg-popover text-[9px] px-1 rounded border border-border text-muted-foreground flex items-center gap-0.5 shadow-sm z-10">
                            <Command className="w-2 h-2" />K
                        </span>
                    </button>
                </TooltipTrigger>
                <TooltipContent>Buscar (Cmd+K)</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <button 
                        title="Notificações"
                        className="relative w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                    </button>
                </TooltipTrigger>
                <TooltipContent>Notificações</TooltipContent>
            </Tooltip>
         </TooltipProvider>

         <div className="h-8 w-px bg-border mx-1" />

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