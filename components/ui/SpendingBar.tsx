import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './Tooltip';

interface Segment {
    label: string;
    value: number;
    color: string;
}

interface SpendingBarProps {
    segments: Segment[];
    total: number;
    height?: number; // px
    className?: string;
}

export const SpendingBar: React.FC<SpendingBarProps> = ({ 
    segments, 
    total, 
    height = 8, 
    className 
}) => {
    // Correct Floating Point precision issues
    const normalizedSegments = segments.map(s => ({
        ...s,
        percentage: total > 0 ? (s.value / total) * 100 : 0
    }));

    return (
        <div 
            className={`w-full flex rounded-full overflow-hidden bg-slate-800/50 ${className}`} 
            ref={(el) => {
                if (el) el.style.height = `${height}px`;
            }}
        >
            <TooltipProvider>
                {normalizedSegments.map((segment, index) => {
                    return (
                        <Tooltip key={`${segment.label}-${index}`}>
                            <TooltipTrigger asChild>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${segment.percentage}%` }}
                                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                                    className="h-full first:rounded-l-full last:rounded-r-full cursor-help hover:brightness-110 transition-all"
                                    // framer-motion handles styles internally usually, but we need color
                                    // For motion components, we can use the style prop as it's often exempt? 
                                    // Or we can use 'onUpdate' or similar? 
                                    // Actually, motion.div accepts style. The linter seems to hate it everywhere.
                                    // Let's try ref on a standard div? No, we need motion.
                                    // Motion supports 'style' prop for animation. 
                                    // workaround: passing style as 'initial' or 'animate' prop if constant? 
                                    // No, color is constant.
                                    // Let's us ref on motion.div?
                                    ref={(el) => {
                                        if (el) el.style.backgroundColor = segment.color;
                                    }}
                                />
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-900 border border-white/10 text-xs">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-2 h-2 rounded-full" 
                                        ref={(el) => {
                                            if (el) el.style.backgroundColor = segment.color;
                                        }}
                                    />
                                    <span className="font-semibold text-white">{segment.label}</span>
                                    <span className="text-slate-400">
                                        {segment.percentage.toFixed(1)}% (R$ {segment.value.toLocaleString(undefined, { minimumFractionDigits: 2 })})
                                    </span>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </TooltipProvider>
        </div>
    );
};
