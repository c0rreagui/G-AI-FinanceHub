import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Lightbulb, Utensils, ShoppingCart, ArrowUpRight, Wallet } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrencyBRL } from '../../utils/formatters';
import { TransactionType } from '../../types';

const InsightCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode, color: string }> = ({ icon: Icon, title, children, color }) => (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center`} style={{backgroundColor: `${color}20`}}>
                <Icon className="w-6 h-6" style={{color: color}}/>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
        </div>
        <div className="mt-4 text-gray-300 space-y-2">
            {children}
        </div>
    </div>
);

export const InsightsView: React.FC = () => {
    const { transactions, goals } = useDashboardData();

    // Simple logic for insights based on mock data
    const foodExpenses = transactions.filter(t => t.category.id === 'cat1' && t.type === TransactionType.DESPESA).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const emergencyGoal = goals.find(g => g.name === 'Reserva de Emergência');

    return (
        <>
            <PageHeader 
                icon={Lightbulb} 
                title="Insights & Análises" 
                breadcrumbs={['FinanceHub', 'Insights']} 
            />
            <div className="mt-6 flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InsightCard icon={Utensils} title="Análise de Gastos" color="#f59e0b">
                        <p>Você gastou <span className="font-bold text-yellow-400">{formatCurrencyBRL(foodExpenses)}</span> com <span className="font-semibold">Alimentação</span> este mês.</p>
                        <p>Isso representa <span className="font-bold text-yellow-400">5.8%</span> do seu gasto total com cartão de crédito. Considere cozinhar em casa para economizar.</p>
                    </InsightCard>

                    <InsightCard icon={Wallet} title="Progresso das Metas" color="#3b82f6">
                         {emergencyGoal && emergencyGoal.status === 'Concluída' && (
                            <p>Parabéns! Você completou sua meta de <span className="font-semibold text-blue-400">{emergencyGoal.name}</span>, atingindo <span className="font-bold text-blue-400">{formatCurrencyBRL(emergencyGoal.targetAmount)}</span>. Um passo importante para sua segurança financeira!</p>
                         )}
                         <p>Sua meta <span className="font-semibold text-blue-400">'Viagem para o Japão'</span> está 42.5% completa. Continue assim!</p>
                    </InsightCard>

                    <InsightCard icon={ArrowUpRight} title="Oportunidades" color="#10b981">
                        <p>Detectamos que seu salário foi a única entrada de receita este mês. </p>
                        <p>Considere explorar fontes de renda extra, como freelancing ou investimentos, para acelerar suas metas financeiras.</p>
                    </InsightCard>
                     <InsightCard icon={ShoppingCart} title="Assinaturas" color="#8b5cf6">
                        <p>Não encontramos assinaturas recorrentes nos seus dados recentes.</p>
                        <p>Fique de olho em cobranças mensais para garantir que você não está pagando por serviços que não utiliza.</p>
                    </InsightCard>
                </div>
            </div>
        </>
    );
};