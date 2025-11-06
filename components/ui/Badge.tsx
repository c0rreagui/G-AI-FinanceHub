
import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    color?: 'green' | 'red' | 'blue' | 'yellow' | 'gray';
}

const colorClasses = {
    green: 'bg-green-500/10 text-green-400 ring-green-500/20',
    red: 'bg-red-500/10 text-red-400 ring-red-500/20',
    blue: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
    gray: 'bg-gray-500/10 text-gray-400 ring-gray-500/20',
};

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray' }) => {
    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[color]}`}>
            {children}
        </span>
    );
};
