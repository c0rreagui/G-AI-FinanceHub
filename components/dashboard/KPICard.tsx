import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { PrivacyMask } from '../ui/PrivacyMask';
import { TrendingUp } from '../Icons';
import { formatCurrencyBRL } from '../../utils/formatters';

export const CountUp: React.FC<{ value: number, duration?: number }> = ({ value, duration = 1.5 }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;
        const startValue = 0; // Always start from 0 for this effect
        
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);
            
            // EaseOutExpo
            const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
            
            setDisplayValue(startValue + (value - startValue) * ease);

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);

    return <>{formatCurrencyBRL(displayValue)}</>;
};

export const KPICard: React.FC<{ title: string; value: number; trend: number; icon: any; color: string }> = ({ title, value, trend, icon: Icon, color }) => {
    // Fix Hydration Mismatch: Generate sparkline data only on client
    const [sparklineData, setSparklineData] = useState<number[]>([]);

    useEffect(() => {
        setSparklineData(Array.from({ length: 20 }).map(() => Math.random() * 100));
    }, []);

    return (
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:opacity-10 transition-opacity`} />
            <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-xl ${color} bg-opacity-10`}>
                        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
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
                    <h3 className="text-2xl font-bold text-white font-mono tracking-tight">
                        <CountUp value={value} />
                    </h3>
                </PrivacyMask>

                {/* Sparkline Mock */}
                <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden flex items-end gap-[1px] opacity-50">
                    {sparklineData.map((height, i) => (
                        <div
                            key={i}
                            className={`w-full rounded-t-sm ${color.replace('bg-', 'bg-')}`}
                            style={{ height: `${height}%`, opacity: 0.3 + (i/20)*0.7 }}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
