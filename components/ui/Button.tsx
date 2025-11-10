import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'destructive';
    size?: 'default' | 'sm';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'default', ...props }) => {
    const baseClasses = "rounded-xl font-semibold focus:outline-none disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ease-in-out transform";
    
    const sizeClasses = {
        default: 'px-5 py-2.5',
        sm: 'px-3 py-1.5 text-sm',
    };

    const variantClasses = {
        primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-indigo-500/40 focus:ring-4 focus:ring-indigo-500/50',
        secondary: 'bg-white/10 text-gray-200 hover:bg-white/20 focus:ring-4 focus:ring-white/30 border border-white/20',
        destructive: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-red-500/40 focus:ring-4 focus:ring-red-500/50',
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