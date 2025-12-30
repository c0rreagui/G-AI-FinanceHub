import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Settings, User } from '../Icons';
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
import { Sliders, UserCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
    const { logout, user } = useAuth();
    const [activeTab, setActiveTab] = useState('settings');

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
                        {/* Informações do Usuário */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <UserCircle className="w-5 h-5 text-primary" />
                                Informações da Conta
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <span className="text-sm text-muted-foreground">Email</span>
                                    <span className="text-sm font-medium">{user?.email || 'Não conectado'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border/50">
                                    <span className="text-sm text-muted-foreground">Nome</span>
                                    <span className="text-sm font-medium">{user?.user_metadata?.name || 'Anônimo'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-muted-foreground">Membro desde</span>
                                    <span className="text-sm font-medium">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <motion.div variants={itemVariants}><ApiKeySettings /></motion.div>

                        {/* Ações da Conta */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Zona de Perigo</h2>
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
        </>
    );
};
