import React from 'react';
import { LoadingSpinner } from '../LoadingSpinner';
import { SignalIcon, XCircleIcon } from '../Icons';

interface LiveStatusIndicatorProps {
  status: 'idle' | 'connecting' | 'connected' | 'error' | 'closing';
}

const statusConfig = {
  idle: { text: null, icon: null, color: '' },
  connecting: { text: 'Conectando ao chat de voz...', icon: LoadingSpinner, color: 'text-gray-400' },
  connected: { text: 'Conectado. Chat de voz ativo.', icon: SignalIcon, color: 'text-green-400' },
  error: { text: 'Erro de conexão. Verifique o microfone.', icon: XCircleIcon, color: 'text-red-400' },
  closing: { text: 'Encerrando conexão...', icon: LoadingSpinner, color: 'text-gray-400' },
};

export const LiveStatusIndicator: React.FC<LiveStatusIndicatorProps> = ({ status }) => {
  if (status === 'idle' || !statusConfig[status].text) {
    return null;
  }

  const { text, icon: IconComponent, color } = statusConfig[status];

  return (
    <div className={`flex items-center justify-center gap-2 text-sm mb-2 transition-all ${color}`}>
      {IconComponent && <IconComponent className="w-4 h-4" />}
      <span>{text}</span>
    </div>
  );
};
