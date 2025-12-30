import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useDashboardData } from '@/hooks/useDashboardData';
import { format, subMonths, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Copy, ArrowRight, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

interface CloneMonthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CloneMonthDialog({ isOpen, onClose }: CloneMonthDialogProps) {
  const { cloneMonth, isMutating } = useDashboardData();
  const [sourceMonth, setSourceMonth] = useState<string>(format(subMonths(new Date(), 1), 'yyyy-MM')); // Default: Last month
  const [targetMonth, setTargetMonth] = useState<string>(format(new Date(), 'yyyy-MM')); // Default: Current month

  // Generate options for the last 12 months and next 12 months
  const generateMonthOptions = () => {
      const options = [];
      const today = new Date();
      for (let i = -12; i <= 12; i++) {
          const date = addMonths(today, i);
          options.push({
              value: format(date, 'yyyy-MM'),
              label: format(date, 'MMMM yyyy', { locale: ptBR }),
              date: date
          });
      }
      return options;
  };

  const options = generateMonthOptions();

  const handleClone = async () => {
    if (!sourceMonth || !targetMonth) return;
    if (sourceMonth === targetMonth) {
        alert("O mês de origem e destino devem ser diferentes.");
        return;
    }

    // Parse dates (append -01 to make it a valid date string for parsing if needed, or just new Date)
    const sourceDate = new Date(`${sourceMonth}-01T12:00:00`);
    const targetDate = new Date(`${targetMonth}-01T12:00:00`);

    try {
        await cloneMonth(sourceDate, targetDate);
        onClose();
    } catch (error) {
        console.error("Clone failed", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Copy className="w-5 h-5" />
            </div>
            <div>
                <DialogTitle>Clonar Mês</DialogTitle>
                <DialogDescription>
                    Copie todas as transações de um mês para outro.
                </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-6 space-y-6">
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex gap-3 text-yellow-600 dark:text-yellow-400 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>
                    Recomendamos clonar apenas para meses vazios. Transações duplicadas podem ser geradas se o mês de destino já tiver registros.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                    <Label>Copiar de</Label>
                    <Select value={sourceMonth} onValueChange={setSourceMonth}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="capitalize">
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <ArrowRight className="w-4 h-4 text-muted-foreground mt-6" />

                <div className="flex-1 space-y-2">
                    <Label>Para</Label>
                    <Select value={targetMonth} onValueChange={setTargetMonth}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="capitalize">
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isMutating}>
            Cancelar
          </Button>
          <Button onClick={handleClone} disabled={isMutating} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isMutating ? 'Clonando...' : 'Clonar Transações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
