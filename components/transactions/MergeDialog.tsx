import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatCurrency } from '@/utils/formatters';
import { Merge } from 'lucide-react';
import { CategoryPicker } from '@/components/ui/CategoryPicker';
import { SmartDatePicker } from '@/components/ui/SmartDatePicker';

interface MergeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transactionIds: string[];
  onComplete?: () => void;
}

export function MergeDialog({ isOpen, onClose, transactionIds, onComplete }: MergeDialogProps) {
  const { transactions, mergeTransactions, categories } = useDashboardData();
  const [description, setDescription] = useState('');

  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedTransactions = transactions.filter(t => transactionIds.includes(t.id));
  const totalAmount = selectedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const isMixedTypes = selectedTransactions.some(t => t.type !== selectedTransactions[0]?.type);

  useEffect(() => {
    if (isOpen && selectedTransactions.length > 0) {
      // Default to the first transaction's details or a generic one
      const primary = selectedTransactions[0];
      setDescription(primary.description); // Or maybe 'Fusão: ...'
      setCategoryId(primary.category_id);
      setDate(primary.date.split('T')[0]);
    }
  }, [isOpen, transactionIds]);

  const handleMerge = async () => {
    if (!description || !categoryId || !date) return;
    
    setIsLoading(true);
    try {
        await mergeTransactions(transactionIds, {
            description,
            category_id: categoryId,
            date: new Date(date).toISOString(),
            // type and status will be inferred or defaulted in the hook
        });
        onComplete?.();
        onClose();
    } catch (error) {
        console.error("Merge failed", error);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <Merge className="w-5 h-5" />
            </div>
            <div>
                <DialogTitle>Unificar Transações</DialogTitle>
                <DialogDescription>
                    Você está prestes a fundir {transactionIds.length} transações em uma única.
                </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6">
            <div className="bg-secondary/50 p-4 rounded-lg flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    <p>Total Combinado</p>
                    <p className="text-xs mt-1">{transactionIds.length} itens selecionados</p>
                </div>
                <div className="text-right">
                    <p className={`text-xl font-bold ${totalAmount >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {formatCurrency(totalAmount)}
                    </p>
                    {isMixedTypes && (
                        <p className="text-xs text-orange-500 flex items-center justify-end gap-1 mt-1">
                             Tipos mistos (Receita/Despesa)
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Nova Descrição</Label>
                    <Input 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Compras da Semana"
                    />
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                         <Label>Categoria</Label>
                         <CategoryPicker
                            categories={categories}
                            selectedCategoryId={categoryId}
                            onSelectCategory={setCategoryId}
                         />
                    </div>
                    <div className="space-y-2">
                        <Label>Data</Label>
                         <SmartDatePicker
                            value={date}
                            onChange={setDate}
                         />
                    </div>
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleMerge} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Merge className="w-4 h-4 mr-2" />
            {isLoading ? 'Unificando...' : 'Unificar Agora'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
