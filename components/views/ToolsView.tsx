import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Wrench } from '../Icons';
import { ReceiptScanner } from '../tools/ReceiptScanner';
import { useAuth } from '../../hooks/useAuth';
import { ViewType } from '../../types';
import { Button } from '../ui/Button';
import { Settings } from '../Icons';
import { Card } from '../ui/Card';
import { CompoundInterestCalculator } from '../investments/CompoundInterestCalculator';
import { RateComparator } from '../tools/RateComparator';
import { FinancialQuiz } from '../education/FinancialQuiz';

import { LoanSimulator } from '../tools/LoanSimulator';
import { InflationCalculator } from '../tools/InflationCalculator';

interface ToolsViewProps {
  setCurrentView: (view: ViewType) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ setCurrentView }) => {
  const { apiKey } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <PageHeader setCurrentView={setCurrentView} icon={Wrench} title="Ferramentas" breadcrumbs={['FinanceHub', 'Ferramentas']} />
      <div className="mt-6 flex-grow overflow-y-auto pr-2 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Calculadora de Juros Compostos - Full Width on Mobile, Half on Desktop */}
          <div className="md:col-span-2 xl:col-span-2">
            <CompoundInterestCalculator />
          </div>

          {/* Comparador de Taxas */}
          <div className="md:col-span-1 xl:col-span-1">
            <RateComparator />
          </div>

          {/* Simulador de Financiamento */}
          <div className="md:col-span-1 xl:col-span-1">
            <LoanSimulator />
          </div>

          {/* Calculadora de Inflação */}
          <div className="md:col-span-1 xl:col-span-1">
            <InflationCalculator />
          </div>

          {/* Quiz Financeiro */}
          <div className="md:col-span-1 xl:col-span-1">
            <FinancialQuiz />
          </div>

          {/* Scanner de Recibos */}
          <div className="md:col-span-1 xl:col-span-1">
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
