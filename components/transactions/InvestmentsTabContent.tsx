import React, { useMemo } from 'react';
import { Transaction } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TrendingUp, PlusCircle, PieChart, ArrowUpRight, ShieldCheck } from '../Icons';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';
import { useDialog } from '../../hooks/useDialog';

interface InvestmentsTabContentProps {
    transactions: Transaction[];
}

export const InvestmentsTabContent: React.FC<InvestmentsTabContentProps> = ({ transactions }) => {
    const { openDialog } = useDialog();

    // Calculate totals
    const totalInvested = useMemo(() => {
        return transactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
    }, [transactions]);

    // Mock monthly return (since we don't have real asset performance data yet)
    // In a real app, this would come from an API
    const monthlyReturn = totalInvested * 0.012; // 1.2% mock return

    const handleNewInvestment = () => {
        openDialog('add-transaction', { 
            isInvestmentMode: true 
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Premium Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="bg-gradient-to-br from-emerald-900/40 to-black border-emerald-500/20 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-24 h-24 text-emerald-400" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-400 uppercase tracking-wider">Total Investido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white font-mono tracking-tight">
                                {formatCurrency(totalInvested)}
                            </div>
                            <p className="text-xs text-emerald-400/70 mt-1 flex items-center">
                                <ShieldCheck className="w-3 h-3 mr-1" /> Patrimônio Protegido
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="bg-gradient-to-br from-cyan-900/40 to-black border-cyan-500/20 overflow-hidden relative group">
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <PieChart className="w-24 h-24 text-cyan-400" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-cyan-400 uppercase tracking-wider">Rendimento Estimado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white font-mono tracking-tight">
                                + {formatCurrency(monthlyReturn)}
                            </div>
                            <p className="text-xs text-cyan-400/70 mt-1 flex items-center">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> +1.2% este mês (Simulado)
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    {...({ className: "flex flex-col justify-center" } as any)}
                >
                    <Button 
                        onClick={handleNewInvestment}
                        className="h-full min-h-[120px] bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 border-0 shadow-lg shadow-emerald-900/20 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                                <PlusCircle className="w-8 h-8 text-white" />
                            </div>
                            <span className="font-bold text-lg text-white">Novo Aporte</span>
                        </div>
                    </Button>
                </motion.div>
            </div>

            {/* Assets List */}
            <Card className="border-white/5 bg-black/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Meus Ativos
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Ativo / Descrição</th>
                                    <th className="px-6 py-4 font-medium">Categoria</th>
                                    <th className="px-6 py-4 font-medium">Data</th>
                                    <th className="px-6 py-4 font-medium text-right">Valor</th>
                                    <th className="px-6 py-4 font-medium text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                    <TrendingUp className="w-6 h-6 text-gray-600" />
                                                </div>
                                                <p>Nenhum investimento registrado ainda.</p>
                                                <Button variant="ghost" size="sm" onClick={handleNewInvestment} className="text-emerald-400 hover:text-emerald-300">
                                                    Começar a Investir
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-white">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs">
                                                        {t.description.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    {t.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10">
                                                    {t.category.name}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 font-mono text-sm leading-none">
                                                {formatDate(t.date)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-emerald-400 font-mono tracking-tight">
                                                {formatCurrency(Math.abs(t.amount))}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                                                    Ativo
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
