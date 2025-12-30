import React from 'react';
import { motion } from 'framer-motion';

interface BudgetRingProps {
    spent: number;
    limit: number;
    size?: number; // px
    strokeWidth?: number; // px
    color?: string;
    showLabel?: boolean;
    className?: string;
}

export const BudgetRing: React.FC<BudgetRingProps> = ({ 
    spent, 
    limit, 
    size = 120, 
    strokeWidth = 8,
    color = '#10B981', // emerald-500
    showLabel = true,
    className
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    
    // Prevent division by zero
    const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const isOverBudget = limit > 0 && spent > limit;
    const finalColor = isOverBudget ? '#EF4444' : color; // Switch to red if over budget

    return (
        <div 
            className={`relative flex items-center justify-center ${className}`} 
            ref={(el) => {
                if (el) {
                    el.style.width = typeof size === 'number' ? `${size}px` : size;
                    el.style.height = typeof size === 'number' ? `${size}px` : size;
                }
            }}
        >
            {/* Background Ring */}
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={isOverBudget ? '#EF4444' : color}
                    strokeWidth={strokeWidth}
                    strokeOpacity={0.2}
                />
                
                {/* Progress Ring */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={finalColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>

            {/* Label */}
            {showLabel && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold text-white tracking-tighter">
                        {limit > 0 ? Math.round((spent / limit) * 100) : 0}%
                    </span>
                    <span className={`text-xs uppercase font-bold tracking-wider ${isOverBudget ? 'text-red-400' : 'text-slate-400'}`}>
                        {isOverBudget ? 'Excedido' : 'Usado'}
                    </span>
                </div>
            )}
        </div>
    );
};
