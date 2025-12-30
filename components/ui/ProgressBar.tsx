import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    percentage: number;
    color?: 'primary' | 'success' | 'danger';
}

// Updated to use the new Design System semantic colors with gradients.
const colorClasses = {
    primary: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    success: 'bg-gradient-to-r from-green-400 to-emerald-500',
    danger: 'bg-gradient-to-r from-red-500 to-orange-500',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color = 'primary' }) => {
    const safePercentage = Math.max(0, Math.min(100, percentage));
    return (
        <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
                {...({ className: `${colorClasses[color]} h-2 rounded-full` } as any)}
                initial={{ width: 0 }}
                animate={{ width: `${safePercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />
        </div>
    );
};