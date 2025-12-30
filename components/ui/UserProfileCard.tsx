
import React, { useState, useRef, useEffect } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ProgressBar } from './ProgressBar';
import { Badge } from './Badge';
import { Card, CardContent } from './Card';
import { UserRank } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const getRankVariant = (rank: UserRank): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    switch (rank) {
        case UserRank.BRONZE: return 'destructive';
        case UserRank.PRATA: return 'secondary';
        case UserRank.OURO: return 'warning';
        case UserRank.PLATINA: return 'default';
        case UserRank.DIAMANTE: return 'default';
        default: return 'secondary';
    }
}

export const UserProfileCard: React.FC = () => {
    const { userLevel, loading } = useDashboardData();
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const infoRef = useRef<HTMLDivElement>(null);

    // Efeito para fechar o tooltip ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
                setIsInfoVisible(false);
            }
        };

        if (isInfoVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isInfoVisible]);

    if (loading || !userLevel) {
        return (
            <div className="card animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-5 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="mt-4">
                    <div className="h-8 bg-gray-700 rounded w-1/4"></div>
                    <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                            <div className="h-4 bg-gray-700 rounded w-1/5"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    const progress = (userLevel.xp / userLevel.xpToNextLevel) * 100;
    const isHighRank = [UserRank.OURO, UserRank.PLATINA, UserRank.DIAMANTE].includes(userLevel.rank);

    return (
        <Card className="h-full">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="relative flex items-center gap-2" ref={infoRef}>
                        <h2 className="text-xl font-semibold text-white">Seu Perfil de Gamificação</h2>
                        <button 
                          onClick={() => setIsInfoVisible(!isInfoVisible)}
                          className="p-2 -m-2 rounded-full text-gray-500 hover:bg-white/10"
                          aria-label="Exibir informações sobre como ganhar pontos de experiência (XP)"
                          aria-expanded={isInfoVisible ? true : false}
                        >
                          <span className="w-5 h-5 rounded-full border border-dashed border-gray-500 text-xs flex items-center justify-center cursor-help">?</span>
                        </button>
                        <AnimatePresence>
                            {isInfoVisible && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    {...({ className: "absolute top-full left-0 mt-2 w-64 p-3 bg-black/80 border border-white/20 rounded-lg text-sm text-gray-300 shadow-lg backdrop-blur-md z-10" } as any)}
                                >
                                    <p className="font-bold mb-1 text-white">Como ganhar XP?</p>
                                    <ul className="list-disc list-inside text-xs space-y-1">
                                        <li><span className="font-semibold text-green-400">+10 XP</span> por transação adicionada.</li>
                                        <li><span className="font-semibold text-cyan-400">+50 XP</span> por meta criada.</li>
                                        <li><span className="font-semibold text-yellow-400">+100 XP</span> por dívida quitada.</li>
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <Badge 
                        variant={getRankVariant(userLevel.rank)} 
                        className={isHighRank ? 'shimmer-badge' : ''}
                    >
                        {userLevel.rank}
                    </Badge>
                </div>
                <div className="mt-4">
                    <p className="text-3xl font-bold text-white">Nível {userLevel.level}</p>
                    <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                            <span>Progresso</span>
                            <span>{userLevel.xp} / {userLevel.xpToNextLevel} XP</span>
                        </div>
                        <ProgressBar percentage={progress} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
