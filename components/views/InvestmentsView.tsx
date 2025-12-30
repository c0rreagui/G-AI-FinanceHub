import React, { useState } from 'react';
import { PageHeader } from '../layout/PageHeader';
import { PiggyBank, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useInvestments } from '../../hooks/useInvestments';
import { LoadingSpinner } from '../LoadingSpinner';
import { AddInvestmentModal } from '../investments/AddInvestmentModal';
import { InvestmentSummary } from '../investments/InvestmentSummary';
import { AssetAllocationChart } from '../investments/AssetAllocationChart';
import { AssetList } from '../investments/AssetList';
import { CompoundInterestCalculator } from '../investments/CompoundInterestCalculator';
import { Card, CardContent } from '../ui/Card';

import { Investment, InvestmentType, ViewType } from '../../types';

interface InvestmentsViewProps {
  setCurrentView: (view: ViewType) => void;
}

export const InvestmentsView: React.FC<InvestmentsViewProps> = ({ setCurrentView }) => {
  const { investments, loading } = useInvestments();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [filter, setFilter] = useState<InvestmentType | 'ALL'>('ALL');

  const filteredInvestments = investments.filter(inv =>
    filter === 'ALL' ? true : inv.type === filter
  );

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingInvestment(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader setCurrentView={setCurrentView}
          icon={PiggyBank}
          title="Investimentos"
          breadcrumbs={[{ label: 'FinanceHub' }, { label: 'Investimentos', active: true }]}
        />
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Novo Aporte
        </Button>
      </div>

      <InvestmentSummary investments={investments} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-lg font-semibold text-white">Meus Ativos</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filter === 'ALL' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('ALL')}
                    className="h-8 text-xs"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filter === InvestmentType.RENDA_FIXA ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(InvestmentType.RENDA_FIXA)}
                    className="h-8 text-xs"
                  >
                    Renda Fixa
                  </Button>
                  <Button
                    variant={filter === InvestmentType.ACOES ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(InvestmentType.ACOES)}
                    className="h-8 text-xs"
                  >
                    Ações
                  </Button>
                  <Button
                    variant={filter === InvestmentType.FIIS ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(InvestmentType.FIIS)}
                    className="h-8 text-xs"
                  >
                    FIIs
                  </Button>
                  <Button
                    variant={filter === InvestmentType.CRIPTO ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(InvestmentType.CRIPTO)}
                    className="h-8 text-xs"
                  >
                    Cripto
                  </Button>
                </div>
              </div>
              <AssetList investments={filteredInvestments} onEdit={handleEdit} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="min-h-[300px]">
            <CardContent className="h-full flex flex-col items-center justify-center p-6">
              <h3 className="text-lg font-semibold text-white mb-4 self-start">Alocação</h3>
              <AssetAllocationChart investments={investments} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <CompoundInterestCalculator />
      </div>

      <AddInvestmentModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        investmentToEdit={editingInvestment}
      />
    </div>
  );
};

