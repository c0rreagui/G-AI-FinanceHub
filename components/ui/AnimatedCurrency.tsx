
import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';

interface AnimatedCurrencyProps {
    value: number;
    className?: string;
}

export const AnimatedCurrency: React.FC<AnimatedCurrencyProps> = ({ value, className }) => {
    // Usamos o valor anterior como ponto de partida para a animação,
    // ou 0 se for a primeira renderização.
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest: number) => Math.round(latest * 100) / 100); 

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 0.8,
            ease: "easeOut"
        });
        // Define o valor inicial para a animação
        count.set(count.get());
        return controls.stop;
    }, [value]);

    const formattedValue = useTransform(rounded, (latest: number) => formatCurrency(latest));

    return <motion.span {...({ className } as any)}>{formattedValue}</motion.span>;
};