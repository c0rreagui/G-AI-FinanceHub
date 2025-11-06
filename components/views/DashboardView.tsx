import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { BarChart as BarChartIcon, Wallet, ArrowUpRight, ArrowDownLeft } from '../Icons';
import { useDashboardData } from '../../hooks/useDashboardData';
import { formatCurrencyBRL } from '../../utils/formatters';
import { Goal, TransactionType, Debt } from '../../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';
import { ProgressBar } from '../ui/ProgressBar';

// Mock data for the monthly balance chart to make it more interesting
const monthlyBalanceData = [
  { month: 'Jul', receitas: 6500, despesas: 4200 },
  { month: 'Ago', receitas: 7000, despesas: 5000 },
  { month: 'Set', receitas: 7200, despesas: 4800 },
  { month: 'Out', receitas: 8000, despesas: 5124.80 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg text-sm">
        <p className="label font-bold text-white">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
           <p key={index} style={{ color: pld.color }}>
             {`${pld.name}: ${formatCurrencyBRL(pld.value)}`}
           </p>
        ))}
      </div>
    );
  }
  return null;
};


const GoalItem: React.FC<{ goal: Goal }> = ({ goal }) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-white">{goal.name}</span>
                <span className="text-xs text-gray-400">{formatCurrencyBRL(goal.currentAmount)} / {formatCurrencyBRL(goal.targetAmount)}</span>
            </div>
            <ProgressBar percentage={progress} />
        </div>
    );
}

const DebtItem: React.FC<{ debt: Debt }> = ({ debt }) => {
    const progress = (debt.paidAmount / debt.totalAmount) * 100;
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-white">{debt.name}</span>
                <span className="text-xs text-gray-400">{formatCurrencyBRL(debt.paidAmount)} / {formatCurrencyBRL(debt.totalAmount)}</span>
            </div>
            <ProgressBar percentage={progress} color="red"/>
        </div>
    );
}


export const DashboardView: React.FC = () => {
    const { summary, transactions, goals, debts } = useDashboardData();
    
    const expenseByCategory = transactions
      .filter(t => t.type === TransactionType.DESPESA)
      .reduce((acc, t) => {
        const categoryName = t.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = { name: categoryName, value: 0, color: t.category.color };
        }
        acc[categoryName].value += Math.abs(t.amount);
        return acc;
      }, {} as any);
    
    const pieChartData = Object.values(expenseByCategory);

    return (
        <>
            <PageHeader 
                icon={BarChartIcon} 
                title="Dashboard" 
                breadcrumbs={['FinanceHub', 'Dashboard']} 
            />
             <div className="mt-6 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                               <Wallet className="w-6 h-6 text-blue-400" />
                           </div>
                           <div>
                             <h3 className="text-sm font-medium text-gray-400">Saldo Total</h3>
                             <p className="text-2xl font-semibold text-white mt-1">{formatCurrencyBRL(summary.totalBalance)}</p>
                           </div>
                       </div>
                       <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex items-center gap-4">
                           <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                               <ArrowUpRight className="w-6 h-6 text-green-400" />
                           </div>
                           <div>
                             <h3 className="text-sm font-medium text-gray-400">Receitas do Mês</h3>
                             <p className="text-2xl font-semibold text-green-400 mt-1">{formatCurrencyBRL(summary.monthlyIncome)}</p>
                           </div>
                       </div>
                       <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex items-center gap-4">
                           <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                               <ArrowDownLeft className="w-6 h-6 text-red-400" />
                           </div>
                           <div>
                             <h3 className="text-sm font-medium text-gray-400">Despesas do Mês</h3>
                             <p className="text-2xl font-semibold text-red-400 mt-1">{formatCurrencyBRL(Math.abs(summary.monthlyExpenses))}</p>
                           </div>
                       </div>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex-grow flex flex-col">
                        <h2 className="text-lg font-semibold text-white mb-4">Balanço Mensal</h2>
                        <div className="flex-grow">
                           <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyBalanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                    <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} fontSize={12} />
                                    <YAxis tickFormatter={(value) => `R$${value/1000}k`} tick={{ fill: '#9ca3af' }} fontSize={12} />
                                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}}/>
                                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                                    <Bar dataKey="receitas" fill="#22c55e" name="Receitas" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="despesas" fill="#ef4444" name="Despesas" radius={[4, 4, 0, 0]} />
                                 </BarChart>
                           </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Coluna Direita */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Despesas por Categoria</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                    return (
                                        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                                        {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}>
                                    {pieChartData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Metas</h2>
                        <div className="space-y-4">
                            {goals.filter(g => g.status === 'Em Andamento').map(goal => <GoalItem key={goal.id} goal={goal} />)}
                        </div>
                    </div>
                     <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Dívidas Ativas</h2>
                        <div className="space-y-4">
                            {debts.filter(d => d.status === 'Ativa').map(debt => <DebtItem key={debt.id} debt={debt} />)}
                        </div>
                    </div>
                </div>
             </div>
        </>
    );
};