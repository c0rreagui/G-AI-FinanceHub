import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Wrench } from '../Icons';
import { ReceiptScanner } from '../tools/ReceiptScanner';
import { useAuth } from '../../hooks/useAuth';

export const ToolsView: React.FC = () => {
  const { apiKey } = useAuth(); // Puxa a apiKey do hook

  return (
    <>
      <PageHeader icon={Wrench} title="Ferramentas" breadcrumbs={['FinanceHub', 'Ferramentas']} />
      <div className="mt-6 flex-grow overflow-y-auto pr-2">
        {apiKey ? (
          // Se a chave existe, mostra o Scanner
          <ReceiptScanner />
        ) : (
          // Se não existe, pede para o usuário configurar
          <div className="text-center text-gray-400 p-8 bg-white/5 rounded-lg">
            <p>A ferramenta de Scanner (OCR) usa a API do Google AI.</p>
            <p className="mt-2">Por favor, configure sua chave de API na tela de 'Configurações' para usar esta funcionalidade.</p>
          </div>
        )}
      </div>
    </>
  );
};