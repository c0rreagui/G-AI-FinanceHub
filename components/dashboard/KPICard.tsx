import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { PrivacyMask } from '../ui/PrivacyMask';
import { TrendingUp } from '../Icons';
import { formatCurrency } from '../../utils/formatters';
import { motion } from 'framer-motion';

export const CountUp: React.FC<{ value: number, duration?: number }> = ({ value, duration = 1.5 }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;
        const startValue = 0; 
        
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);
            
            const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
            
            setDisplayValue(startValue + (value - startValue) * ease);

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return <>{formatCurrency(displayValue)}</>;
};

export const KPICard: React.FC<{ title: string; value: number; trend: number; icon: any; color: string }> = ({ title, value, trend, icon: Icon, color }) => {
    const [sparklinePath, setSparklinePath] = useState("");

    useEffect(() => {
        // Generate a smooth random path
        const points = Array.from({ length: 10 }).map((_, i) => ({
            x: i * 10,
            y: Math.random() * 30 + 10 // Random height between 10 and 40
        }));
        
        // Simple SVG path generation (L for lines, could be C for curves)
        const path = `M ${points.map(p => `${p.x},${50 - p.y}`).join(' L ')}`;
        setSparklinePath(path);
    }, []);

    // Extract color class for text/bg
    const colorClass = color.replace('bg-', '');

    return (
        <Card className={`bg-card border-border hover:border-${colorClass}-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-${colorClass}-500/10 group overflow-hidden relative`}>
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:opacity-10 transition-opacity`} />
            <CardContent className="p-5 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                        <Icon className={`w-5 h-5 text-${colorClass}-400`} />
                    </div>
                    {trend !== 0 && (
                        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">{title}</p>
                <PrivacyMask>
                    <h3 className="text-2xl font-bold text-foreground font-mono tracking-tight">
                        <CountUp value={value} />
                    </h3>
                </PrivacyMask>
            </CardContent>

            {/* Sparkline Background */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 90 50" preserveAspectRatio="none">
                    <motion.path
                        d={sparklinePath}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`text-${colorClass}-400`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    <motion.path
                        d={`${sparklinePath} L 90,50 L 0,50 Z`}
                        fill="currentColor"
                        stroke="none"
                        className={`text-${colorClass}-400`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    />
                </svg>
            </div>
        </Card>
    );
};
