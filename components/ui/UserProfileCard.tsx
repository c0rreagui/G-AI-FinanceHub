import React from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { ProgressBar } from './ProgressBar';
import { Badge } from './Badge';
import { UserRank } from '../../types';

const getRankColor = (rank: UserRank): 'yellow' | 'gray' | 'blue' | 'green' | 'red' => {
    switch (rank) {
        case UserRank.BRONZE: return 'red';
        case UserRank.PRATA: return 'gray';
        case UserRank.OURO: return 'yellow';
        case UserRank.PLATINA: return 'blue';
        case UserRank.DIAMANTE: return 'blue';
        default: return 'gray';
    }
}

export const UserProfileCard: React.FC = () => {
    const { userLevel, loading } = useDashboardData();

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

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 group relative">
                    <h2 className="text-xl font-semibold text-white">Seu Perfil de Gamificação</h2>
                    <div className="w-4 h-4 rounded-full border border-dashed border-gray-500 text-xs flex items-center justify-center text-gray-500 cursor-help">?</div>
                    <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-black/80 border border-white/20 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-md">
                        <p className="font-bold mb-1 text-white">Como ganhar XP?</p>
                        <ul className="list-disc list-inside text-xs space-y-1">
                            <li><span className="font-semibold text-green-400">+10 XP</span> por transação adicionada.</li>
                            <li><span className="font-semibold text-cyan-400">+50 XP</span> por meta criada.</li>
                            <li><span className="font-semibold text-yellow-400">+100 XP</span> por dívida quitada.</li>
                        </ul>
                    </div>
                </div>
                <Badge color={getRankColor(userLevel.rank)}>{userLevel.rank}</Badge>
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
        </div>
    );
};