
import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';

interface AnimatedSummaryCardProps {
    title: string;
    amount: number;
    icon: React.ElementType;
}

export const AnimatedSummaryCard: React.FC<AnimatedSummaryCardProps> = ({ title, amount, icon: Icon }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest: number) => Math.round(latest));

    useEffect(() => {
        const controls = animate(count, amount, {
            duration: 0.8,
            ease: "easeOut"
        });
        return controls.stop;
    }, [amount]);

    const formattedAmount = useTransform(rounded, (latest: number) => formatCurrency(latest));

    return (
        <div className="card">
            <div className="flex items-center justify-between text-gray-300">
                <span>{title}</span>
                <Icon className="w-5 h-5"/>
            </div>
            <motion.p
                {...({ className: "text-3xl font-bold text-white mt-2" } as any)}
                key={`${title}-amount`}
            >
                {formattedAmount}
            </motion.p>
        </div>
    );
};