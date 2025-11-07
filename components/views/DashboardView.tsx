import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { BarChart, ArrowDownLeft, ArrowUpRight, Wallet, Target, PlusCircle } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrencyBRL, formatDate } from '../../utils/formatters';
import { LoadingSpinner } from '../LoadingSpinner';
import { Transaction, TransactionType } from '../../types';
import { Button } from '../ui/Button';
import { useDialog } from '../../hooks/useDialog';
import { ProgressBar } from '../ui/ProgressBar';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const SummaryCard: React.FC<{ title: string; amount: number; icon: React.ElementType; color: string; }> = ({ title, amount, icon: Icon, color }) => (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
        <div className="flex items-center gap-4">
            <Icon className={`w-8 h-8 ${color}`} />
            <p className="text-gray-300">{title}</p>
        </div>
        <p className="text-3xl font-bold text-white mt-4">{formatCurrencyBRL(amount)}</p>
    </div>
);

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isExpense = transaction.type === TransactionType.DESPESA;
    const amount = isExpense ? -Math.abs(transaction.amount) : transaction.amount;
    return (
        <li className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: `${transaction.category.color}20`}}>
                    <transaction.category.icon className="w-5 h-5" style={{color: transaction.category.color}} />
                </div>
                <div>
                    <p className="font-semibold text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-400">{formatDate(transaction.date, 'dayMonth')}</p>
                </div>
            </div>
            <p className={`font-semibold ${isExpense ? 'text-red-400' : 'text-green-400'}`}>
                {isExpense ? '' : '+'} {formatCurrencyBRL(amount)}
            </p>
        </li>
    );
};

export const DashboardView: React.FC = () => {
    const { summary, transactions, goals, loading } = useDashboardData();
    const { openDialog } = useDialog();

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const expensesByCategory = transactions
        .filter(t => t.type === TransactionType.DESPESA)
        .reduce((acc, t) => {
            const categoryName = t.category.name;
            const amount = Math.abs(t.amount);
            if (!acc[categoryName]) {
                acc[categoryName] = { name: categoryName, value: 0, color: t.category.color };
            }
            acc[categoryName].value += amount;
            return acc;
        }, {} as { [key: string]: { name: string; value: number; color: string } });
    
    const pieChartData = Object.values(expensesByCategory);
    const firstGoal = goals.find(g => g.status === 'Em Andamento');

    return (
        <>
            <PageHeader
                icon={BarChart}
                title="Dashboard"
                breadcrumbs={['FinanceHub', 'Dashboard']}
                actions={<Button onClick={() => openDialog('add-transaction')}><PlusCircle className="w-4 h-4 mr-2"/> Nova Transação</Button>}
            />

            <div className="mt-6 flex-grow overflow-y-auto pr-2">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SummaryCard title="Saldo Atual" amount={summary.totalBalance} icon={Wallet} color="text-blue-400" />
                    <SummaryCard title="Receitas do Mês" amount={summary.monthlyIncome} icon={ArrowUpRight} color="text-green-400" />
                    <SummaryCard title="Despesas do Mês" amount={Math.abs(summary.monthlyExpenses)} icon={ArrowDownLeft} color="text-red-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                    {/* Recent Transactions & Goal */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Transações Recentes</h2>
                            <ul className="divide-y divide-white/10">
                                {transactions.slice(0, 5).map(t => <TransactionItem key={t.id} transaction={t} />)}
                            </ul>
                        </div>
                        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Progresso da Meta</h2>
                            {firstGoal ? (
                                <div>
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-white">{firstGoal.name}</p>
                                        <Target className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <p className="text-sm text-gray-400 mt-2">
                                        {formatCurrencyBRL(firstGoal.currentAmount)} de {formatCurrencyBRL(firstGoal.targetAmount)}
                                    </p>
                                    <ProgressBar percentage={(firstGoal.currentAmount / firstGoal.targetAmount) * 100} color="indigo" />
                                </div>
                            ) : (
                                <p className="text-gray-400">Nenhuma meta em andamento.</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Expenses Chart */}
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex flex-col">
                        <h2 className="text-xl font-semibold text-white mb-4">Distribuição de Despesas</h2>
                        <div className="flex-grow w-full h-80">
                             <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                        {/* FIX: Explicitly type `entry` as `any` to resolve TypeScript inference error. */}
                                        {pieChartData.map((entry: any, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => [formatCurrencyBRL(value), 'Valor']}
                                        contentStyle={{
                                            backgroundColor: 'rgba(20, 20, 30, 0.8)',
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                            borderRadius: '1rem'
                                        }}
                                        cursor={{ fill: 'rgba(139, 92, 246, 0.1)'}}
                                    />
                                    <Legend iconSize={10} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
