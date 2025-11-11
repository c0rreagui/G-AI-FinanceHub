
import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    color?: 'green' | 'red' | 'blue' | 'yellow' | 'gray';
}

// Updated to use the new Design System semantic colors for consistency.
const colorClasses = {
    green: 'bg-[oklch(var(--success-oklch)_/_0.1)] text-[oklch(var(--success-oklch))] ring-[oklch(var(--success-oklch)_/_0.2)]',
    red: 'bg-[oklch(var(--danger-oklch)_/_0.1)] text-[oklch(var(--danger-oklch))] ring-[oklch(var(--danger-oklch)_/_0.2)]',
    blue: 'bg-[oklch(var(--info-oklch)_/_0.1)] text-[oklch(var(--info-oklch))] ring-[oklch(var(--info-oklch)_/_0.2)]',
    yellow: 'bg-[oklch(var(--warning-oklch)_/_0.1)] text-[oklch(var(--warning-oklch))] ring-[oklch(var(--warning-oklch)_/_0.2)]',
    gray: 'bg-gray-500/10 text-gray-400 ring-gray-500/20',
};

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray' }) => {
    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[color]}`}>
            {children}
        </span>
    );
};