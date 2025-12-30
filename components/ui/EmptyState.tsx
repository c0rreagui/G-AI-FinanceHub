import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/utils';

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    action?: ReactNode;
    className?: string;
    children?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
    title, 
    description, 
    icon: Icon, 
    action,
    className,
    children
}) => {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-8 text-center h-full min-h-[200px]",
            "animate-in fade-in zoom-in-95 duration-500",
            className
        )}>
            {Icon && (
                <div className="relative mb-6 group">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    {/* Icon container */}
                    <div className={cn(
                        "relative bg-gradient-to-br from-primary/20 to-accent/10 p-5 rounded-2xl",
                        "ring-1 ring-white/10 shadow-lg",
                        "animate-[float_3s_ease-in-out_infinite]"
                    )}>
                        <Icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
                    </div>
                </div>
            )}
            <h3 className="text-xl font-semibold text-foreground tracking-tight">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
                    {description}
                </p>
            )}
            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
            {children}
        </div>
    );
};