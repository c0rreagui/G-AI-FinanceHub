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
            {/* Shimmer Glow Effect when score is excellent */}
            {score >= 800 && (
                <>
                    {/* Animated gradient border glow */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none rounded-xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, transparent 50%, rgba(34, 197, 94, 0.1) 100%)',
                        }}
                        animate={{
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    {/* Subtle sparkle effect */}
                    <motion.div
                        className="absolute top-2 right-8 w-1 h-1 bg-green-400 rounded-full"
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.2, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: 0,
                        }}
                    />
                    <motion.div
                        className="absolute top-4 right-4 w-1.5 h-1.5 bg-emerald-300 rounded-full"
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: 0.8,
                        }}
                    />
                    <motion.div
                        className="absolute bottom-6 left-6 w-1 h-1 bg-green-300 rounded-full"
                        animate={{
                            opacity: [0, 0.8, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: 1.5,
                        }}
                    />
                </>
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
                    <div className="absolute top-0 left-0 w-full h-48 rounded-full border-[12px] border-muted/20 border-b-0 box-border [clip-path:inset(0_0_50%_0)]"></div>

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
                        className="flex flex-col items-center justify-center gap-1"
                    >
                        <Text className="text-4xl font-bold text-foreground leading-none" style={{ color }}>
                            {score}
                        </Text>
                        <Text size="sm" variant="muted" className="uppercase tracking-wider font-bold">
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
