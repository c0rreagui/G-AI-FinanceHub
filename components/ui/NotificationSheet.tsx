import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationItem } from './NotificationItem';
import { Sheet } from './Sheet';
import { Button } from './Button';
import { CheckCheck, Bell } from 'lucide-react';
import { EmptyState } from './EmptyState';
// import { ScrollArea } from './ScrollArea'; // Removed as per new Sheet structure

interface NotificationSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationSheet: React.FC<NotificationSheetProps> = ({ isOpen, onClose }) => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearRead } = useNotifications();

    const unreadNotifications = notifications.filter(n => !n.read);
    const readNotifications = notifications.filter(n => n.read);

    return (
        <Sheet isOpen={isOpen} onClose={onClose} title="Notificações">
            <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10">
                            <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {unreadCount > 0 
                                    ? `${unreadCount} não ${unreadCount === 1 ? 'lida' : 'lidas'}` 
                                    : 'Tudo em dia'}
                            </p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs text-primary hover:text-primary/80"
                        >
                            <CheckCheck className="w-4 h-4 mr-1" />
                            Marcar todas
                        </Button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <EmptyState
                        icon={Bell}
                        title="Sem notificações"
                        description="Você está em dia! Suas notificações aparecerão aqui."
                        className="py-16"
                    />
                ) : (
                    <div className="space-y-6">
                        {/* Unread Notifications */}
                        {unreadNotifications.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-1">
                                    Novas ({unreadNotifications.length})
                                </h3>
                                <div className="space-y-2">
                                    {unreadNotifications.map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onMarkAsRead={markAsRead}
                                            onDelete={deleteNotification}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Read Notifications */}
                        {readNotifications.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Anteriores ({readNotifications.length})
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearRead}
                                        className="h-6 text-xs text-muted-foreground hover:text-destructive"
                                    >
                                        Limpar lidas
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {readNotifications.map((notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onMarkAsRead={markAsRead}
                                            onDelete={deleteNotification}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Sheet>
    );
};
