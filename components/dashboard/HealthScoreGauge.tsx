import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Text } from '../ui/typography';
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
        if (s >= 800) return '#22c55e'; // Green
        if (s >= 500) return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    const color = getColor(score);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
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
            <CardContent className="flex-1 flex flex-col items-center justify-center pt-4">
                <div className="relative w-48 h-24 overflow-hidden">
                    {/* Background Arc */}
                    <div className="absolute top-0 left-0 w-full h-48 rounded-full border-[12px] border-muted/20 border-b-0 box-border" style={{ clipPath: 'inset(0 0 50% 0)' }}></div>
                    
                    {/* Colored Arc (Needle approximation or filled arc) */}
                    {/* For a simple gauge, we can rotate a filled semi-circle or use SVG */}
                    <svg viewBox="0 0 100 50" className="w-full h-full absolute top-0 left-0">
                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted/20" />
                        <motion.path 
                            d="M 10 50 A 40 40 0 0 1 90 50" 
                            fill="none" 
                            stroke={color} 
                            strokeWidth="12" 
                            strokeDasharray="126" // Approx length of arc (PI * 40)
                            strokeDashoffset={126 - (126 * percentage) / 100}
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: 126 }}
                            animate={{ strokeDashoffset: 126 - (126 * percentage) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>

                    {/* Needle Center */}
                    <div className="absolute bottom-0 left-1/2 w-full text-center -translate-x-1/2 translate-y-1/2 z-10">
                         {/* Optional: Needle element */}
                    </div>
                </div>
                
                <div className="text-center mt-[-10px] z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Text size="3xl" weight="bold" style={{ color }}>
                            {score}
                        </Text>
                        <Text size="xs" variant="muted" className="uppercase tracking-wider">
                            {score >= 800 ? 'Excelente' : score >= 500 ? 'Bom' : 'Atenção'}
                        </Text>
                    </motion.div>
                </div>
            </CardContent>
        </Card>
    );
};
