// components/views/DevToolsView.tsx
import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Zap } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { motion } from 'framer-motion';

const DevToolCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => {
    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-yellow-300">{title}</h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">{description}</p>
            <div className="flex flex-wrap gap-2">
                {children}
            </div>
        </div>
    );
};

export const DevToolsView: React.FC = () => {
    const { 
        addRandomTransactions,
        deleteAllUserData,
        grantXp,
        simulateError,
        isMutating
    } = useDashboardData();
    const { openDialog } = useDialog();

    const handleDeleteAllData = () => {
        openDialog('confirmation', {
            title: 'Resetar Dados do Usuário',
            message: 'Tem certeza que deseja apagar TODOS os dados (transações, metas, dívidas, etc.) deste usuário? Esta ação é irreversível.',
            confirmText: 'Sim, Resetar Tudo',
            confirmVariant: 'destructive',
            onConfirm: deleteAllUserData,
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      };
    
      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };

    return (
        <div className="flex flex-col h-full">
            <PageHeader 
                icon={Zap} 
                title="Ferramentas de Desenvolvedor" 
                breadcrumbs={['FinanceHub', 'DevTools']} 
            />
            <motion.div 
                className="mt-6 flex-grow overflow-y-auto pr-2 space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <DevToolCard title="Gerenciamento de Dados" description="Adicione ou remova dados em massa para testes.">
                        <Button onClick={() => addRandomTransactions(20)} disabled={isMutating}>
                            +20 Transações Aleatórias
                        </Button>
                        <Button onClick={handleDeleteAllData} variant="destructive" disabled={isMutating}>
                            Resetar Dados do Usuário
                        </Button>
                    </DevToolCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <DevToolCard title="Gamificação" description="Manipule o sistema de XP e níveis.">
                        <Button onClick={() => grantXp(500)} disabled={isMutating}>
                            +500 XP
                        </Button>
                    </DevToolCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <DevToolCard title="Simulação de Estado" description="Force estados específicos da aplicação para testes de UI.">
                        <Button onClick={simulateError} variant="secondary">
                            Simular Erro de API
                        </Button>
                    </DevToolCard>
                </motion.div>
            </motion.div>
        </div>
    );
};