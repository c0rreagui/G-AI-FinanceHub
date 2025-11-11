import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { formatCurrencyBRL } from '../../utils/formatters';

interface AnimatedSummaryCardProps {
    title: string;
    amount: number;
}

export const AnimatedSummaryCard: React.FC<AnimatedSummaryCardProps> = ({ title, amount }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));

    useEffect(() => {
        const controls = animate(count, amount, {
            duration: 0.8,
            ease: "easeOut"
        });
        return controls.stop;
    }, [amount]);

    const formattedAmount = useTransform(rounded, latest => formatCurrencyBRL(latest));

    return (
        <div className="card">
            <p className="text-gray-300">{title}</p>
            <motion.p
                className="text-3xl font-bold text-white mt-2"
                // Adicionando uma chave que muda com o título garante que a animação reinicie
                // se o componente for reutilizado para um tipo de dado diferente.
                key={`${title}-amount`}
            >
                {formattedAmount}
            </motion.p>
        </div>
    );
};
