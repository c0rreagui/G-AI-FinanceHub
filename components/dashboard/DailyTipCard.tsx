import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Lightbulb, X, Share2, RefreshCw } from 'lucide-react';
import { getDailyTip } from '../../utils/financialTips';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../hooks/useToast';

export const DailyTipCard: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [tip, setTip] = useState(getDailyTip());
    const [isRotating, setIsRotating] = useState(false);
    const { showToast } = useToast();

    const handleShare = () => {
        navigator.clipboard.writeText(`Dica Financeira: ${tip}`);
        showToast('Dica copiada para a área de transferência!', { type: 'success' });
    };

    const handleRefresh = () => {
        setIsRotating(true);
        setTimeout(() => {
            setTip(getDailyTip());
            setIsRotating(false);
        }, 500);
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={tip}
                initial={{ opacity: 0, rotateX: -90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                exit={{ opacity: 0, rotateX: 90 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="perspective-1000"
            >
                <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={handleRefresh}
                            className={`p-1.5 text-amber-500/50 hover:text-amber-500 transition-colors rounded-full hover:bg-amber-500/10 ${isRotating ? 'animate-spin' : ''}`}
                            title="Nova dica"
                        >
                            <RefreshCw size={14} />
                        </button>
                        <button 
                            onClick={handleShare}
                            className="p-1.5 text-amber-500/50 hover:text-amber-500 transition-colors rounded-full hover:bg-amber-500/10"
                            title="Compartilhar"
                        >
                            <Share2 size={14} />
                        </button>
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="p-1.5 text-amber-500/50 hover:text-amber-500 transition-colors rounded-full hover:bg-amber-500/10"
                            title="Fechar"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className="p-2 bg-amber-500/20 rounded-full shrink-0">
                            <Lightbulb className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-amber-500 mb-1 uppercase tracking-wider">Dica do Dia</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {tip}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};
