
import React from 'react';

interface ProgressBarProps {
    percentage: number;
    color?: 'primary' | 'success' | 'danger';
}

// Updated to use the new Design System semantic colors.
const colorClasses = {
    primary: 'bg-[oklch(var(--primary-oklch))]',
    success: 'bg-[oklch(var(--success-oklch))]',
    danger: 'bg-[oklch(var(--danger-oklch))]',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color = 'primary' }) => {
    return (
        <div className="w-full bg-gray-700 rounded-full h-2">
            <div
                className={`${colorClasses[color]} h-2 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};