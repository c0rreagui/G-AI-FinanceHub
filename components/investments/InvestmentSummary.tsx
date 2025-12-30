import React from 'react';
import { Investment } from '../../types';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart, DollarSign } from 'lucide-react';

interface InvestmentSummaryProps {
  investments: Investment[];
}

export const InvestmentSummary: React.FC<InvestmentSummaryProps> = ({ investments }) => {
  const totalInvested = investments.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const totalAssets = investments.length;
  
  const topAsset = investments.reduce((prev, current) => {
    return (Number(prev.amount) > Number(current.amount)) ? prev : current
  }, investments[0] || null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <DollarSign className="w-12 h-12 text-emerald-500" />
        </div>
        <h3 className="text-gray-400 text-sm font-medium">Total Investido</h3>
        <p className="text-2xl font-bold text-white mt-2">{formatCurrency(totalInvested)}</p>
        <div className="mt-4 flex items-center text-sm text-emerald-400">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>+0% (Este mês)</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <PieChart className="w-12 h-12 text-blue-500" />
        </div>
        <h3 className="text-gray-400 text-sm font-medium">Total de Ativos</h3>
        <p className="text-2xl font-bold text-white mt-2">{totalAssets}</p>
        <p className="mt-4 text-sm text-gray-400">
          Diversificado em {new Set(investments.map(i => i.type)).size} classes
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="w-12 h-12 text-purple-500" />
        </div>
        <h3 className="text-gray-400 text-sm font-medium">Maior Posição</h3>
        <p className="text-2xl font-bold text-white mt-2">
          {topAsset ? topAsset.name : '-'}
        </p>
        <p className="mt-4 text-sm text-purple-400">
          {topAsset ? formatCurrency(Number(topAsset.amount)) : 'R$ 0,00'}
        </p>
      </motion.div>
    </div>
  );
};
