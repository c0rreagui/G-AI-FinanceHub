import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Settings } from '../Icons';
import { UserProfileCard } from '../ui/UserProfileCard';
import { AchievementsList } from '../ui/AchievementsList';
import { useDashboardData } from '../../hooks/useDashboardData';
import { LoadingSpinner } from '../LoadingSpinner';
import { ApiKeySettings } from '../ui/ApiKeySettings';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../ui/Button';

export const SettingsView: React.FC = () => {
    const { loading } = useDashboardData();
    const { user } = useAuth();

    const handleLogout = async () => {
      await supabase.auth.signOut();
      // O App.tsx vai detectar isso automaticamente e mostrar a tela de login
    };

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
                    <ApiKeySettings />
                    <AchievementsList />
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 mt-6">
                      <p className="text-center text-gray-400 text-sm mb-4">
                        Logado como: <strong className="text-white">{user?.email}</strong>
                      </p>
                      <Button onClick={handleLogout} variant="secondary" className="w-full">
                        Sair (Logout)
                      </Button>
                      <p className="text-center text-xs text-gray-600 mt-4 md:hidden">
                        FinanceHub v1.4.0
                      </p>
                    </div>
                </div>
            )}
        </>
    );
};