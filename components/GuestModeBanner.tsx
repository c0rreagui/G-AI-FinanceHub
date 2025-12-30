import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';

export const GuestModeBanner: React.FC = () => {
  const { logout, isDeveloper, isGuest } = useAuth();

  if (isDeveloper || !isGuest) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-lg z-[50] backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">Modo Convidado</span>
        <span className="text-xs opacity-80 hidden min-[380px]:inline">
          Seus dados são salvos apenas neste dispositivo.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-white hover:bg-white/20 h-8 text-xs"
        >
          Sair / Criar Conta
        </Button>
      </div>
    </div>
  );
};
