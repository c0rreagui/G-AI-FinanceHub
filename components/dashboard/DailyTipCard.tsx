import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Lightbulb, X } from 'lucide-react';
import { getDailyTip } from '../../utils/financialTips';
import { motion, AnimatePresence } from 'framer-motion';

export const DailyTipCard: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const tip = getDailyTip();

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2">
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="text-amber-500/50 hover:text-amber-500 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className="p-2 bg-amber-500/20 rounded-full shrink-0">
                            <Lightbulb className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-amber-500 mb-1 uppercase tracking-wider">Dica do Dia</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {tip}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};
