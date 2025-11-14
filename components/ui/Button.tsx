import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends Omit<React.ComponentProps<typeof motion.button>, 'variant'> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'destructive';
    size?: 'default' | 'sm';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'default', ...props }) => {
    const baseClasses = "relative overflow-hidden rounded-lg font-semibold focus:outline-none disabled:opacity-60 disabled:saturate-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ease-in-out transform";
    
    const sizeClasses = {
        default: 'px-5 py-2.5',
        sm: 'px-3 py-1.5 text-sm',
    };

    const variantClasses = {
        primary: 'bg-gradient-to-br from-cyan-400 to-green-500 text-white hover:bg-gradient-to-bl hover:shadow-cyan-500/30 focus:ring-4 focus:ring-[oklch(var(--primary-oklch)_/_0.5)]',
        secondary: 'bg-[oklch(var(--card-oklch))] text-gray-200 hover:bg-[oklch(var(--border-oklch))] focus:ring-4 focus:ring-white/30 border border-[oklch(var(--border-oklch))]',
        destructive: 'bg-[oklch(var(--danger-oklch))] text-white hover:shadow-red-500/40 focus:ring-4 focus:ring-[oklch(var(--danger-oklch)_/_0.5)]',
    };

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
        circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
        circle.classList.add("ripple");

        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    };

    return (
        <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${props.className || ''}`}
            onClick={(e) => {
                createRipple(e);
                if(props.onClick) props.onClick(e);
            }}
            {...props}
        >
            {children}
        </motion.button>
    );
};