import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Wrench } from '../Icons';
import { ReceiptScanner } from '../tools/ReceiptScanner';
import { useAuth } from '../../hooks/useAuth';
import { ViewType } from '../../types';
import { Button } from '../ui/Button';
import { Settings } from '../Icons';

interface ToolsViewProps {
  setCurrentView: (view: ViewType) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ setCurrentView }) => {
  const { apiKey } = useAuth();

  return (
    <>
      <PageHeader icon={Wrench} title="Ferramentas" breadcrumbs={['FinanceHub', 'Ferramentas']} />
      <div className="mt-6 flex-grow overflow-y-auto pr-2">
        {apiKey ? (
          <ReceiptScanner />
        ) : (
          <div className="card text-center text-gray-400">
            <h3 className="text-lg font-semibold text-white">Funcionalidade Indisponível</h3>
            <p className="mt-2">A ferramenta de Scanner (OCR) usa a API do Google AI.</p>
            <p className="mt-1">
              Por favor, configure sua chave de API na tela de 'Ajustes' para usar esta funcionalidade.
            </p>
             <p className="text-xs text-gray-500 mt-2 italic">
              Nota: O uso da API pode estar sujeito a custos.
            </p>
            <Button onClick={() => setCurrentView('settings')} className="mt-6 mx-auto">
              <Settings className="w-4 h-4 mr-2" />
              Configurar Chave de API
            </Button>
          </div>
        )}
      </div>
    </>
  );
};