import React, { useState, useEffect } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useToast } from '../../hooks/useToast';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../hooks/useAuth';
import { TelemetryDashboard } from '../telemetry/TelemetryDashboard';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { useDialog } from '../../hooks/useDialog';
import { Badge } from '../ui/Badge';
import { ViewType } from '../../types';
import {
    Activity, Database, Server, Shield, Smartphone, WifiOff,
    AlertTriangle, TrashIcon, Cpu, Layout,
    ArrowLeftRight, Target, TrendingDown, Bell, PlusCircle, RefreshCw
} from 'lucide-react';
import { PageHeader } from '../layout/PageHeader';

const StatusIndicator: React.FC<{ status: 'online' | 'offline' | 'warning'; label: string }> = ({ status, label }) => (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                status === 'warning' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' :
                    'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                }`} />
            <span className={`text-xs font-bold ${status === 'online' ? 'text-green-500' :
                status === 'warning' ? 'text-yellow-500' :
                    'text-red-500'
                }`}>
                {status.toUpperCase()}
            </span>
        </div>
    </div>
);

const StatCard: React.FC<{ label: string; value: number | string; icon: React.ElementType; color: string }> = ({ label, value, icon: Icon, color }) => (
    <div className="flex flex-col p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
        <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">{label}</span>
            <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <span className="text-2xl font-bold text-white font-mono">{value}</span>
    </div>
);

interface DevToolsViewProps {
    setCurrentView: (view: ViewType) => void;
}

export const DevToolsView: React.FC<DevToolsViewProps> = ({ setCurrentView }) => {
    const {
        transactions, goals, debts, scheduledTransactions, summary, userLevel,
        addMockData, clearAllUserData, addMockTransactions, addMockGoals,
        addMockDebts, addMockInvestments, clearTable, forceError, loading
    } = useDashboardData();

    const { isDeveloper } = useAuth();
    const { openDialog } = useDialog();
    const { showToast } = useToast();
    const { addNotification } = useNotifications();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [activeTab, setActiveTab] = useState<'devtools' | 'telemetry'>('devtools');

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        globalThis.addEventListener('online', handleOnline);
        globalThis.addEventListener('offline', handleOffline);
        return () => {
            globalThis.removeEventListener('online', handleOnline);
            globalThis.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSeed = async () => {
        await addMockData();
    };

    const handleClear = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
            return;
        }
        await clearAllUserData();
        setConfirmDelete(false);
    };

    const handleResetCache = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
            return;
        }

        try {
            // 1. Storage
            localStorage.clear();
            sessionStorage.clear();

            // 2. Clear all IndexedDB databases
            const databases = await indexedDB.databases();
            for (const db of databases) {
                if (db.name) indexedDB.deleteDatabase(db.name);
            }

            // 3. Clear Cache Storage
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }

            // 4. Unregister Service Workers
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map(reg => reg.unregister()));
            }

            showToast('Reset Radical concluído! Reiniciando...', { type: 'success' });

            setTimeout(() => {
                globalThis.location.href = '/'; // Go back to root
            }, 1000);
        } catch (error) {
            console.error('Erro no reset:', error);
            showToast('Erro ao limpar cache, mas recarregando...', { type: 'error' });
            setTimeout(() => globalThis.location.reload(), 2000);
        }
    };

    return (
        <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            <PageHeader
                title="Developer Console"
                icon={Cpu}
                setCurrentView={setCurrentView}
                breadcrumbs={[{ label: 'FinanceHub' }, { label: 'DevTools', active: true }]}
                actions={
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-3 py-1">
                        v4.0.0-beta
                    </Badge>
                }
            />

            {/* Tabs (only show if developer) */}
            {isDeveloper && (
                <div className="flex gap-2 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('devtools')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'devtools'
                            ? 'text-cyan-400 border-b-2 border-cyan-400'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        🛠️ DevTools
                    </button>
                    <button
                        onClick={() => setActiveTab('telemetry')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'telemetry'
                            ? 'text-cyan-400 border-b-2 border-cyan-400'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        🔍 Telemetria
                    </button>
                </div>
            )}

            {/* Render based on active tab */}
            {activeTab === 'telemetry' && isDeveloper ? (
                <TelemetryDashboard />
            ) : (
                <>
                    {/* Original DevTools content */}

                    {/* System Status Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 border-cyan-500/20 bg-gradient-to-br from-cyan-950/10 to-transparent">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-cyan-400" />
                                    System Health
                                </CardTitle>
                                <CardDescription>Monitoramento em tempo real dos serviços</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <StatusIndicator status={isOnline ? 'online' : 'offline'} label="Conectividade de Rede" />
                                <StatusIndicator status="online" label="Supabase Database" />
                                <StatusIndicator status="online" label="Auth Service" />
                                <StatusIndicator status={loading ? 'warning' : 'online'} label="Data Sync Status" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5 text-purple-400" />
                                    Database Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <StatCard label="Transações" value={transactions.length} icon={ArrowLeftRight} color="text-blue-400" />
                                    <StatCard label="Metas" value={goals.length} icon={Target} color="text-green-400" />
                                    <StatCard label="Dívidas" value={debts.length} icon={TrendingDown} color="text-red-400" />
                                    <StatCard label="Agendamentos" value={scheduledTransactions.length} icon={Bell} color="text-yellow-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Data Management Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Server className="w-5 h-5 text-green-400" />
                                    Gerenciamento de Dados
                                </CardTitle>
                                <CardDescription>Ferramentas para popular e limpar dados</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button onClick={() => addMockTransactions(5)} variant="outline" size="sm" className="justify-start">
                                        <PlusCircle className="w-4 h-4 mr-2 text-green-400" /> +5 Transações
                                    </Button>
                                    <Button onClick={() => addMockGoals(2)} variant="outline" size="sm" className="justify-start">
                                        <PlusCircle className="w-4 h-4 mr-2 text-blue-400" /> +2 Metas
                                    </Button>
                                    <Button onClick={() => addMockDebts(2)} variant="outline" size="sm" className="justify-start">
                                        <PlusCircle className="w-4 h-4 mr-2 text-red-400" /> +2 Dívidas
                                    </Button>
                                    <Button onClick={() => addMockInvestments(3)} variant="outline" size="sm" className="justify-start">
                                        <PlusCircle className="w-4 h-4 mr-2 text-purple-400" /> +3 Investimentos
                                    </Button>
                                </div>

                                <div className="h-px bg-white/10 my-4" />

                                <div className="flex flex-col gap-3">
                                    <Button onClick={handleSeed} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-0">
                                        <Database className="w-4 h-4 mr-2" />
                                        Popular Tudo (Full Seed)
                                    </Button>
                                    <Button
                                        onClick={handleClear}
                                        variant={confirmDelete ? "destructive" : "outline"}
                                        className={`w-full ${confirmDelete ? 'animate-pulse' : ''}`}
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        {confirmDelete ? 'Tem certeza? Clique para confirmar' : 'Limpar Todos os Dados (Factory Reset)'}
                                    </Button>
                                    <Button
                                        onClick={handleResetCache}
                                        variant="outline"
                                        className="w-full border-orange-500/20 text-orange-400 hover:bg-orange-500/10"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Limpar Cache & Reiniciar App
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Layout className="w-5 h-5 text-pink-400" />
                                    UI & UX Testing
                                </CardTitle>
                                <CardDescription>Teste componentes visuais e interações</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="ghost" size="sm" onClick={() => openDialog('add-transaction')} className="justify-start">
                                        <ArrowLeftRight className="w-4 h-4 mr-2" /> Modal Transação
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => openDialog('add-goal')} className="justify-start">
                                        <Target className="w-4 h-4 mr-2" /> Modal Meta
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => openDialog('add-debt')} className="justify-start">
                                        <TrendingDown className="w-4 h-4 mr-2" /> Modal Dívida
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => setCurrentView('design-system')} className="justify-start text-pink-400 hover:text-pink-300">
                                        <Layout className="w-4 h-4 mr-2" /> Design System
                                    </Button>
                                </div>

                                <div className="h-px bg-white/10 my-4" />

                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" size="sm" onClick={() => showToast('Operação realizada com sucesso!', { type: 'success' })}>
                                        Toast Sucesso
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => showToast('Falha na conexão com o servidor.', { type: 'error' })}>
                                        Toast Erro
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => showToast('Nova atualização disponível.', { type: 'info' })}>
                                        Toast Info
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => showToast('Sua sessão irá expirar em breve.', { type: 'info' })}>
                                        Toast Aviso
                                    </Button>
                                </div>

                                <div className="h-px bg-white/10 my-4" />

                                <p className="text-xs text-muted-foreground mb-2">🐛 Debug & Notificações:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            console.log('🔔 DEBUG: Botão clicado');
                                            console.log('🔔 addNotification type:', typeof addNotification);
                                            try {
                                                addNotification({
                                                    title: '🐛 DEBUG Test',
                                                    message: 'Se você vê isso, funciona!',
                                                    type: 'success'
                                                });
                                                console.log('✅ addNotification executou');
                                                showToast('Debug notification sent!', { type: 'success' });
                                            } catch (e) {
                                                console.error('❌ Erro:', e);
                                            }
                                        }}
                                        className="text-orange-400"
                                    >
                                        🐛 Debug Test
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => addNotification({ title: 'Orçamento Atenção', message: 'Você usou 85% do orçamento de Alimentação', type: 'warning' })} className="text-amber-400">⚠️ Warning</Button>
                                    <Button variant="outline" size="sm" onClick={() => addNotification({ title: 'Orçamento Excedido!', message: 'Você ultrapassou 100% do orçamento mensal', type: 'alert' })} className="text-red-400">🚨 Alert</Button>
                                    <Button variant="outline" size="sm" onClick={() => addNotification({ title: 'Meta Atingida!', message: 'Parabéns! Você completou a meta Viagem', type: 'success' })} className="text-emerald-400">✅ Success</Button>
                                    <Button variant="outline" size="sm" onClick={() => addNotification({ title: 'Pagamento Agendado', message: 'Aluguel vence em 2 dias (R$ 2.500)', type: 'info' })} className="text-blue-400">ℹ️ Info</Button>
                                    <Button variant="outline" size="sm" onClick={() => addNotification({ title: 'Dica de Economia', message: 'Reduza 10% nos gastos', type: 'tip' })} className="text-violet-400">💡 Tip</Button>
                                    <Button variant="default" size="sm" onClick={() => { addNotification({ title: 'T1', message: 'Warning', type: 'warning' }); setTimeout(() => addNotification({ title: 'T2', message: 'Info', type: 'info' }), 500); setTimeout(() => addNotification({ title: 'T3', message: 'Success', type: 'success' }), 1000); }} className="bg-gradient-to-r from-violet-600 to-pink-600">🎯 Múltiplas</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Advanced Tools Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-orange-400" />
                                    Chaos Engineering
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button onClick={() => forceError()} variant="destructive" className="w-full">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Simular Crash (Runtime Error)
                                </Button>
                                <Button disabled variant="outline" className="w-full opacity-50 cursor-not-allowed">
                                    <WifiOff className="w-4 h-4 mr-2" />
                                    Simular Offline Mode
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Smartphone className="w-5 h-5 text-indigo-400" />
                                    Environment Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-black/30 rounded-lg p-4 font-mono text-xs text-gray-400 space-y-2">
                                    <div className="flex justify-between">
                                        <span>User Agent:</span>
                                        <span className="text-white">{navigator.userAgent.substring(0, 40)}...</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Screen Resolution:</span>
                                        <span className="text-white">{globalThis.innerWidth}x{globalThis.innerHeight}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Timezone:</span>
                                        <span className="text-white">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Language:</span>
                                        <span className="text-white">{navigator.language}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};