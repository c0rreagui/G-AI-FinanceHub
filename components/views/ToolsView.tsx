import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Wrench } from '../Icons';
import { ReceiptScanner } from '../tools/ReceiptScanner';
import { useAuth } from '../../hooks/useAuth';
import { ViewType } from '../../types';
import { Button } from '../ui/Button';
import { Settings } from '../Icons';
import { Card } from '../ui/Card';
import { CompoundInterestCalculator } from '../tools/CompoundInterestCalculator';
import { RateComparator } from '../tools/RateComparator';
import { FinancialQuiz } from '../education/FinancialQuiz';

interface ToolsViewProps {
  setCurrentView: (view: ViewType) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ setCurrentView }) => {
  const { apiKey } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <PageHeader icon={Wrench} title="Ferramentas" breadcrumbs={['FinanceHub', 'Ferramentas']} />
      <div className="mt-6 flex-grow overflow-y-auto pr-2 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calculadora de Juros Compostos - Full Width on Mobile, Half on Desktop */}
            <div className="lg:col-span-2">
                <CompoundInterestCalculator />
            </div>

            {/* Comparador de Taxas */}
            <div>
                <RateComparator />
            </div>

            {/* Quiz Financeiro */}
            <div>
                <FinancialQuiz />
            </div>

            {/* Scanner de Recibos */}
            <div>
                {apiKey ? (
                <ReceiptScanner />
                ) : (
                <Card className="text-center text-muted-foreground p-6 h-full flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-foreground">Scanner de Recibos (IA)</h3>
                    <p className="mt-2 text-sm">Configure sua chave de API para usar o reconhecimento de recibos.</p>
                    <Button onClick={() => setCurrentView('settings')} className="mt-4" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar API
                    </Button>
                </Card>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};