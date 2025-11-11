
import React from 'react';
import { motion } from 'framer-motion';

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
    const safePercentage = Math.max(0, Math.min(100, percentage));
    return (
        <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
                className={`${colorClasses[color]} h-2 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${safePercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />
        </div>
    );
};