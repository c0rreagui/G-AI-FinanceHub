import React from 'react';
import { motion } from 'framer-motion';

// FIX: Changed props interface to extend framer-motion's component props to resolve type conflicts.
// Omitted 'variant' to avoid conflict with the custom styling variant prop.
interface ButtonProps extends Omit<React.ComponentProps<typeof motion.button>, 'variant'> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'destructive';
    size?: 'default' | 'sm';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'default', ...props }) => {
    const baseClasses = "rounded-lg font-semibold focus:outline-none disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ease-in-out transform";
    
    const sizeClasses = {
        default: 'px-5 py-2.5',
        sm: 'px-3 py-1.5 text-sm',
    };

    const variantClasses = {
        primary: 'bg-gradient-to-br from-cyan-400 to-green-500 text-white hover:shadow-cyan-500/30 focus:ring-4 focus:ring-[oklch(var(--primary-oklch)_/_0.5)]',
        secondary: 'bg-[oklch(var(--card-oklch))] text-gray-200 hover:bg-[oklch(var(--border-oklch))] focus:ring-4 focus:ring-white/30 border border-[oklch(var(--border-oklch))]',
        destructive: 'bg-[oklch(var(--danger-oklch))] text-white hover:shadow-red-500/40 focus:ring-4 focus:ring-[oklch(var(--danger-oklch)_/_0.5)]',
    };

    return (
        <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${props.className || ''}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};
