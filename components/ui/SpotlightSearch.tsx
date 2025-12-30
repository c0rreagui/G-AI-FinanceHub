import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from './Dialog';
import { Input } from './Input';
import { Search, Command, Calculator, Calendar, CreditCard } from 'lucide-react';
import { cn } from '@/utils/utils';

export const SpotlightSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl bg-popover/95 backdrop-blur-xl border-white/10">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Digite um comando ou busque..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-xs text-muted-foreground border rounded px-1.5 py-0.5">ESC</div>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Sugestões</div>
            <div className="flex items-center px-2 py-2 rounded-md hover:bg-accent cursor-pointer">
                <Calculator className="mr-2 h-4 w-4" />
                <span>Nova Transação</span>
            </div>
            <div className="flex items-center px-2 py-2 rounded-md hover:bg-accent cursor-pointer">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Agendar Pagamento</span>
            </div>
            <div className="flex items-center px-2 py-2 rounded-md hover:bg-accent cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Ver Cartões</span>
            </div>
        </div>
        <div className="border-t p-2 bg-muted/50 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
                <Command className="h-3 w-3" />
                <span>FinanceHub Spotlight</span>
            </div>
            <div>v4.0.0</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
