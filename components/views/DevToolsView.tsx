// components/views/DevToolsView.tsx
import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Zap, PlusCircle, TrashIcon, Bell, AlertTriangle, ArrowLeftRight, Target, TrendingDown } from '../Icons';
import { Button } from '../ui/Button';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDialog } from '../../hooks/useDialog';
import { useToast } from '../../hooks/useToast';
import { Input } from '../ui/Input';

const StateInspector: React.FC = () => {
    const { transactions, goals, debts, scheduledTransactions, summary, userLevel } = useDashboardData();
    const dataToShow = { summary, userLevel };

    return (
        <div className="card">
            <h2 className="text-lg font-semibold text-white mb-3">Live State Inspector</h2>
            <ul className="space-y-2 text-sm">
                <li className="flex justify-between items-center">
                    <span className="text-gray-400">Transações:</span>
                    <span className="font-mono font-semibold text-white">{transactions.length}</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="text-gray-400">Metas:</span>
                    <span className="font-mono font-semibold text-white">{goals.length}</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="text-gray-400">Dívidas:</span>
                    <span className="font-mono font-semibold text-white">{debts.length}</span>
                </li>
                <li className="flex justify-between items-center">
                    <span className="text-gray-400">Agendamentos:</span>
                    <span className="font-mono font-semibold text-white">{scheduledTransactions.length}</span>
                </li>
            </ul>
            <details className="mt-4">
                <summary className="cursor-pointer text-xs text-gray-500 hover:text-white">Ver dados computados (JSON)</summary>
                <pre className="mt-2 bg-black/30 p-2 rounded-md text-xs whitespace-pre-wrap font-mono text-cyan-200/80">
                    <code>{JSON.stringify(dataToShow, null, 2)}</code>
                </div>
                );
};