import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Settings } from '../Icons';
import { ApiKeySettings } from '../ui/ApiKeySettings';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';
import { APP_VERSION } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import { BackupManager } from '../settings/BackupManager';
import { BudgetSettings } from '../settings/BudgetSettings';
import { AppearanceSettings } from '../settings/AppearanceSettings';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Sliders, UserCircle, Edit2, Check, X, Camera, Rocket } from 'lucide-react';
import { UserLevelBar } from '../dashboard/UserLevelBar';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { supabase } from '../../services/supabaseClient';
import { useToast } from '../../hooks/useToast';
import { ProfileOnboardingFlow } from '../onboarding/ProfileOnboardingFlow';

export const SettingsView: React.FC = () => {
    const { logout, user, apiKey } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('settings');
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');

    const handleUpdateName = async () => {
        try {
            const { error } = await supabase.auth.updateUser({
                data: { name: newName }
            });
            if (error) throw error;
            setIsEditingName(false);
            showToast('Nome atualizado com sucesso!', { type: 'success' });
            // Force reload or state update would be better, but user object typically updates via subscription
        } catch (error) {
            showToast('Erro ao atualizar nome.', { type: 'error' });
            console.error(error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <>
            <PageHeader
                icon={Settings}
                title={activeTab === 'settings' ? 'Ajustes' : 'Perfil'}
                breadcrumbs={['FinanceHub', activeTab === 'settings' ? 'Ajustes' : 'Perfil']}
                actions={<Button onClick={logout} variant="secondary">Sair</Button>}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow overflow-hidden flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Sliders className="w-4 h-4" />
                        Ajustes
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <UserCircle className="w-4 h-4" />
                        Perfil
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="settings" className="flex-grow overflow-y-auto pr-2 space-y-6 pb-20">
                    <motion.div
                        {...({ className: "space-y-6" } as any)}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}><AppearanceSettings /></motion.div>
                        <motion.div variants={itemVariants}><BudgetSettings /></motion.div>
                        <motion.div variants={itemVariants}><BackupManager /></motion.div>

                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-2">Sobre</h2>
                            <p className="text-sm text-muted-foreground">
                                FinanceHub é seu assistente financeiro pessoal com tecnologia de IA.
                            </p>
                            <p className="text-xs text-muted-foreground mt-4">Versão {APP_VERSION}</p>
                        </Card>
                    </motion.div>
                </TabsContent>

                <TabsContent value="profile" className="flex-grow overflow-y-auto pr-2 space-y-6 pb-20">
                    <motion.div
                        {...({ className: "space-y-6" } as any)}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Status do Perfil */}
                        {(!user?.user_metadata?.avatar_url || !user?.user_metadata?.name || user?.user_metadata?.name === 'Anônimo' || !apiKey) && (
                            <Card className="p-4 bg-primary/5 border-primary/20 border-dashed animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Rocket className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-white">Complete seu Perfil!</h3>
                                        <p className="text-xs text-muted-foreground">Isso ajuda a IA a personalizar suas dicas.</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {!user?.user_metadata?.name || user?.user_metadata?.name === 'Anônimo' ? (
                                            <div className="w-2 h-2 rounded-full bg-red-500" title="Nome pendente" />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-green-500" title="Nome preenchido" />
                                        )}
                                        {!user?.user_metadata?.avatar_url ? (
                                            <div className="w-2 h-2 rounded-full bg-red-500" title="Foto pendente" />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-green-500" title="Foto preenchida" />
                                        )}
                                        {!apiKey ? (
                                            <div className="w-2 h-2 rounded-full bg-red-500" title="API Key pendente" />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-green-500" title="API Key configurada" />
                                        )}
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Informações do Usuário */}
                        <Card className="p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-purple-600/20" />

                            <div className="relative pt-12 text-center flex flex-col items-center">
                                <div id="profile-avatar-step" className="relative mb-4 group">
                                    <div className="w-24 h-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center text-4xl font-bold text-primary shadow-xl overflow-hidden">
                                        {user?.user_metadata?.avatar_url ? (
                                            <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            user?.user_metadata?.name?.charAt(0).toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>

                                <div id="profile-name-step" className="mb-6 w-full max-w-sm">
                                    {isEditingName ? (
                                        <div className="flex items-center gap-2 justify-center">
                                            <Input
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="text-center h-9"
                                                autoFocus
                                            />
                                            <Button size="sm" onClick={handleUpdateName} className="h-9 w-9 p-0 rounded-full bg-green-500 hover:bg-green-600">
                                                <Check className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => setIsEditingName(false)} className="h-9 w-9 p-0 rounded-full">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <h2 className="text-2xl font-bold text-white">{user?.user_metadata?.name || 'Anônimo'}</h2>
                                            <button onClick={() => { setNewName(user?.user_metadata?.name || ''); setIsEditingName(true); }} className="p-1 text-muted-foreground hover:text-white transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                </div>

                                <div id="profile-xp-step" className="w-full max-w-md bg-card/50 rounded-xl p-4 border border-white/5 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progresso</span>
                                        <span className="text-xs text-primary font-bold">Nível {user?.user_metadata?.level || 1}</span>
                                    </div>
                                    <UserLevelBar />
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full max-w-md text-left">
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                        <span className="text-xs text-muted-foreground block mb-1">Membro desde</span>
                                        <span className="font-medium text-sm">
                                            {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                        <span className="text-xs text-muted-foreground block mb-1">Plano Atual</span>
                                        <span className="font-medium text-sm text-yellow-400">PRO</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <motion.div id="profile-api-step" variants={itemVariants}><ApiKeySettings /></motion.div>

                        {/* Ações da Conta */}
                        <Card className="p-6 border-red-900/20 bg-red-950/5">
                            <h2 className="text-xl font-semibold text-red-400 mb-4">Zona de Perigo</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Ações irreversíveis que afetam sua conta.
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10">
                                    Excluir Dados
                                </Button>
                                <Button variant="destructive" onClick={logout}>
                                    Sair da Conta
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>
            <ProfileOnboardingFlow activeTab={activeTab} />
        </>
    );
};
