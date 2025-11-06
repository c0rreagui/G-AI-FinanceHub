import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Settings } from '../Icons';
import { UserProfileCard } from '../ui/UserProfileCard';
import { AchievementsList } from '../ui/AchievementsList';
import { useDashboardData } from '../../hooks/useDashboardData';
import { LoadingSpinner } from '../LoadingSpinner';

export const SettingsView: React.FC = () => {
    const { loading } = useDashboardData();

    return (
        <>
            <PageHeader
                icon={Settings}
                title="Configurações e Perfil"
                breadcrumbs={['FinanceHub', 'Configurações']}
            />
            {loading ? (
                <div className="flex-grow flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="mt-6 flex-grow overflow-y-auto pr-2">
                    <UserProfileCard />
                    <AchievementsList />
                </div>
            )}
        </>
    );
};