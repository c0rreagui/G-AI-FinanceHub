import React from 'react';
import { Notification } from '../../contexts/NotificationContext';
import { AlertTriangle, Info, CheckCircle, AlertCircle, Lightbulb, Eye, Trash2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from './Button';
import { Badge } from './Badge';
import { cn } from '@/utils/utils';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
}

const getIconForType = (type: Notification['type']) => {
    switch (type) {
        case 'alert':
            return <AlertTriangle className="w-5 h-5 text-red-500" />;
        case 'info':
            return <Info className="w-5 h-5 text-blue-500" />;
        case 'success':
            return <CheckCircle className="w-5 h-5 text-emerald-500" />;
        case 'warning':
            return <AlertCircle className="w-5 h-5 text-amber-500" />;
        case 'tip':
            return <Lightbulb className="w-5 h-5 text-violet-500" />;
        default:
            return <Info className="w-5 h-5 text-gray-500" />;
    }
};

const getBackgroundForType = (type: Notification['type']) => {
    switch (type) {
        case 'alert':
            return 'bg-red-500/10 border-red-500/20';
        case 'info':
            return 'bg-blue-500/10 border-blue-500/20';
        case 'success':
            return 'bg-emerald-500/10 border-emerald-500/20';
        case 'warning':
            return 'bg-amber-500/10 border-amber-500/20';
        case 'tip':
            return 'bg-violet-500/10 border-violet-500/20';
        default:
            return 'bg-gray-500/10 border-gray-500/20';
    }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
    notification, 
    onMarkAsRead, 
    onDelete 
}) => {
    const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
        addSuffix: true,
        locale: ptBR
    });

    return (
        <div 
            className={cn(
                "group relative p-4 rounded-xl border transition-all duration-200",
                notification.read 
                    ? "bg-card/50 border-white/5 opacity-60" 
                    : `${getBackgroundForType(notification.type)} shadow-sm`,
                "hover:shadow-md hover:scale-[1.01]"
            )}
        >
            <div className="flex gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                    {getIconForType(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                            "font-semibold text-sm",
                            notification.read ? "text-gray-400" : "text-white"
                        )}>
                            {notification.title}
                        </h4>
                        {!notification.read && (
                            <Badge variant="default" className="bg-primary/20 text-primary text-xs px-2 py-0.5">
                                Novo
                            </Badge>
                        )}
                    </div>

                    <p className={cn(
                        "text-sm leading-relaxed",
                        notification.read ? "text-gray-500" : "text-gray-300"
                    )}>
                        {notification.message}
                    </p>

                    {/* Action Link */}
                    {notification.actionLink && notification.actionLabel && (
                        <a 
                            href={notification.actionLink}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors mt-2"
                            aria-label={`${notification.actionLabel} (abre em nova aba)`}
                            rel="noopener noreferrer"
                        >
                            {notification.actionLabel}
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-gray-500 mt-2">
                        {timeAgo}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.read && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onMarkAsRead(notification.id)}
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                            title="Marcar como lida"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(notification.id)}
                        className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        title="Excluir"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
