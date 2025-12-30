import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

export type NotificationType = 'alert' | 'info' | 'success' | 'warning' | 'tip';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    created_at: string;
    actionLabel?: string;
    actionLink?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'created_at'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
    clearRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load from local storage on mount (or supabase if we had the table set up perfectly)
    // For this implementation, we'll maintain a local hybrid approach 
    // where we check localStorage for guest/demo purposes mostly, 
    // but structure it so it's ready for Supabase sync.
    useEffect(() => {
        const saved = localStorage.getItem('financehub_notifications');
        if (saved) {
            try {
                setNotifications(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse notifications", e);
            }
        }
    }, []);

    // Listen for storage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'financehub_notifications' && e.newValue) {
                try {
                    setNotifications(JSON.parse(e.newValue));
                } catch (err) {
                    console.error('Failed to sync notifications from other tab', err);
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Save to local storage whenever changes happen
    useEffect(() => {
        localStorage.setItem('financehub_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = useCallback((data: Omit<Notification, 'id' | 'read' | 'created_at'>) => {
        const newNotification: Notification = {
            id: uuidv4(),
            ...data,
            read: false,
            created_at: new Date().toISOString()
        };
        // Limit to max 100 notifications to prevent memory leak
        setNotifications(prev => [newNotification, ...prev].slice(0, 100));
        
        // Sound effect or toast could go here
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const deleteNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const clearRead = useCallback(() => {
        setNotifications(prev => prev.filter(n => !n.read));
    }, []);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            clearAll,
            clearRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
