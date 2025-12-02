import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Text } from '../ui/AppTypography';
import { Info } from '../Icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip';

interface HealthScoreGaugeProps {
    score: number;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ score }) => {
    // Score is 0-1000
    // Angle range: -90deg to 90deg (180 degrees total)
    // Map 0-1000 to 0-180
    
    const percentage = Math.min(100, Math.max(0, score / 10));
    const angle = (percentage / 100) * 180 - 90;

    const getColor = (s: number) => {
        if (s >= 800) return '#22c55e'; // Green-500
        if (s >= 500) return '#eab308'; // Yellow-500
        return '#ef4444'; // Red-500
    };

    const color = getColor(score);

    return (
        <Card className="h-full flex flex-col relative overflow-hidden">
             {/* Confetti Effect (CSS based) if score > 800 */}
             {score >= 800 && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            {...({
                                className: "absolute w-2 h-2 bg-yellow-400 rounded-full",
                                initial: { x: "50%", y: "50%", opacity: 1 },
                                animate: { 
                                    x: `${Math.random() * 100}%`, 
                                    y: `${Math.random() * 100}%`, 
                                    opacity: 0,
                                    scale: 0
                                },
                                transition: { duration: 2, repeat: Infinity, delay: i * 0.2 }
                            } as any)}
                        />
                    ))}
                </div>
             )}

            <CardHeader className="pb-2 flex flex-row items-center justify-between z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Saúde Financeira
                </CardTitle>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">
                                Pontuação baseada em saldo positivo, poupança mensal, ausência de dívidas e investimentos.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center pt-4 z-10">
                <div className="relative w-48 h-24 overflow-hidden">
                    {/* Background Arc */}
                    <div className="absolute top-0 left-0 w-full h-48 rounded-full border-[12px] border-muted/20 border-b-0 box-border" style={{ clipPath: 'inset(0 0 50% 0)' }}></div>
                    
                    <svg viewBox="0 0 100 50" className="w-full h-full absolute top-0 left-0">
                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted/20" />
                        <motion.path 
                            d="M 10 50 A 40 40 0 0 1 90 50" 
                            fill="none" 
                            stroke={color} 
                            strokeWidth="12" 
                            strokeDasharray="126" 
                            strokeDashoffset={126 - (126 * percentage) / 100}
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: 126 }}
                            animate={{ strokeDashoffset: 126 - (126 * percentage) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>

                    <div className="absolute bottom-0 left-1/2 w-full text-center -translate-x-1/2 translate-y-1/2 z-10">
                    </div>
                </div>
                
                <div className="text-center mt-[-10px] z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Text size="xl" weight="bold" style={{ color }}>
                            {score}
                        </Text>
                        <Text size="xs" variant="muted" className="uppercase tracking-wider">
                            {score >= 800 ? 'Excelente' : score >= 500 ? 'Bom' : 'Atenção'}
                        </Text>
                    </motion.div>
                </div>
                
                {/* Health Tip */}
                <div className="mt-4 text-xs text-center text-muted-foreground bg-white/5 px-3 py-1 rounded-full">
                    {score >= 800 ? '🎉 Continue assim!' : score >= 500 ? '💡 Tente reduzir gastos supérfluos.' : '⚠️ Atenção às dívidas.'}
                </div>
            </CardContent>
        </Card>
    );
};
