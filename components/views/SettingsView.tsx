import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Settings } from '../Icons';
import { UserProfileCard } from '../ui/UserProfileCard';
import { AchievementsList } from '../ui/AchievementsList';

export const SettingsView: React.FC = () => {
    return (
        <>
            <PageHeader
                icon={Settings}
                title="Configurações e Perfil"
                breadcrumbs={['FinanceHub', 'Configurações']}
            />
            <div className="mt-6 flex-grow overflow-y-auto pr-2">
                <UserProfileCard />
                <AchievementsList />
            </div>
        </>
    );
};
