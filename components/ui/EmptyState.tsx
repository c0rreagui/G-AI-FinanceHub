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
        <div className={cn("flex flex-col items-center justify-center p-8 text-center h-full min-h-[200px] animate-in fade-in zoom-in duration-500", className)}>
            {Icon && (
                <div className="bg-muted/30 p-4 rounded-full mb-4 ring-1 ring-border/50">
                    <Icon className="w-8 h-8 text-muted-foreground/50" />
                </div>
            )}
            <h3 className="text-lg font-medium text-foreground">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
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