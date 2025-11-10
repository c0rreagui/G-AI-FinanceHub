// FIX: Implemented the SettingsView component to provide app settings and user profile information.
import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Settings } from '../Icons';
import { ApiKeySettings } from '../ui/ApiKeySettings';
import { UserProfileCard } from '../ui/UserProfileCard';
import { AchievementsList } from '../ui/AchievementsList';
import { Button } from '../ui/Button';
import { supabase } from '../../services/supabaseClient';

export const SettingsView: React.FC = () => {

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
        }
        // The auth listener in useAuth will handle the state change.
    };

    return (
        <>
            <PageHeader 
                icon={Settings} 
                title="Ajustes e Perfil" 
                breadcrumbs={['FinanceHub', 'Ajustes']}
                actions={<Button onClick={handleLogout} variant="secondary">Sair</Button>}
            />
            <div className="mt-6 flex-grow overflow-y-auto pr-2 space-y-6">
                <ApiKeySettings />
                <UserProfileCard />
                <AchievementsList />

                 <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 mt-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Sobre</h2>
                    <p className="text-sm text-gray-400">
                        FinanceHub é seu assistente financeiro pessoal com tecnologia de IA.
                    </p>
                    <p className="text-xs text-gray-500 mt-4">Versão 2.0.23</p>
                </div>
            </div>
        </>
    );
};