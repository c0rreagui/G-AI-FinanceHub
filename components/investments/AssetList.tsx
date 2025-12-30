import React from 'react';
import { Investment, InvestmentType } from '../../types';
import { TrendingUp, Building2, Bitcoin, Globe, Landmark, Wallet, Pencil } from 'lucide-react';
import { Button } from '../ui/Button';

interface AssetListProps {
  investments: Investment[];
  onEdit: (investment: Investment) => void;
}

const getIconForType = (type: InvestmentType) => {
  switch (type) {
    case InvestmentType.RENDA_FIXA: return Landmark;
    case InvestmentType.ACOES: return TrendingUp;
    case InvestmentType.FIIS: return Building2;
    case InvestmentType.CRIPTO: return Bitcoin;
    case InvestmentType.EXTERIOR: return Globe;
    default: return Wallet;
  }
};

const getColorForType = (type: InvestmentType) => {
  switch (type) {
    case InvestmentType.RENDA_FIXA: return 'text-emerald-500 bg-emerald-500/10';
    case InvestmentType.ACOES: return 'text-blue-500 bg-blue-500/10';
    case InvestmentType.FIIS: return 'text-amber-500 bg-amber-500/10';
    case InvestmentType.CRIPTO: return 'text-violet-500 bg-violet-500/10';
    case InvestmentType.EXTERIOR: return 'text-pink-500 bg-pink-500/10';
    default: return 'text-gray-500 bg-gray-500/10';
  }
};

export const AssetList: React.FC<AssetListProps> = ({ investments, onEdit }) => {
  if (investments.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        Nenhum investimento encontrado. Comece aportando!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {investments.map((inv) => {
        const Icon = getIconForType(inv.type);
        const colorClass = getColorForType(inv.type);
        
        return (
          <div key={inv.id} className="p-4 bg-card rounded-xl border border-white/5 hover:border-white/10 transition-colors group relative">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{inv.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="uppercase bg-white/5 px-2 py-0.5 rounded text-xs font-medium tracking-wider">
                      {inv.ticker || inv.type.replace('_', ' ')}
                    </span>
                    {inv.sector && (
                      <>
                        <span>•</span>
                        <span>{inv.sector}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-white text-lg">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(inv.amount))}
                  </p>
                  <p className="text-sm text-gray-400">
                    {Number(inv.quantity)} cotas
                    {inv.current_price && (
                       <span className="ml-2 text-xs text-gray-500">
                         ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(inv.current_price))}/un)
                       </span>
                    )}
                  </p>
                </div>
                
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEdit(inv)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Pencil className="w-4 h-4 text-gray-400 hover:text-white" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
