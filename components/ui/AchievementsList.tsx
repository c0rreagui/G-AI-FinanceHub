import React from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Achievement } from '../../types';
import { Trophy, LockClosed } from '../Icons';

const AchievementItem: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const isUnlocked = achievement.unlocked;
    return (
        <div className={`flex items-start gap-4 p-4 rounded-lg transition-opacity ${isUnlocked ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${isUnlocked ? 'bg-yellow-500/10' : 'bg-gray-500/10'}`}>
                {isUnlocked ? 
                    <Trophy className="w-6 h-6 text-yellow-400" /> :
                    <LockClosed className="w-6 h-6 text-gray-400" />
                }
            </div>
            <div>
                <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-300'}`}>{achievement.name}</h4>
                <p className="text-sm text-gray-400">{achievement.description}</p>
                {isUnlocked && achievement.dateUnlocked && (
                    <p className="text-xs text-gray-500 mt-1">Desbloqueado em: {new Date(achievement.dateUnlocked).toLocaleDateString('pt-BR')}</p>
                )}
            </div>
        </div>
    );
};

export const AchievementsList: React.FC = () => {
    const { achievements } = useDashboardData();
    return (
        <div className="card mt-6">
            <h2 className="text-xl font-semibold text-white mb-2">Conquistas</h2>
            <div className="divide-y divide-[oklch(var(--border-oklch))] -m-4">
                {achievements.map(ach => (
                    <AchievementItem key={ach.id} achievement={ach} />
                ))}
            </div>
        </div>
    );
};