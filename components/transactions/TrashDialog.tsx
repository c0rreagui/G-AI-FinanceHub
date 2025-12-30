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
import { ScrollArea } from "@/components/ui/ScrollArea";
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Trash, RefreshCw, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/utils';
import { TransactionType } from '@/types';

interface TrashDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrashDialog({ open, onOpenChange }: TrashDialogProps) {
  const { deletedTransactions, restoreTransaction, permanentDeleteTransaction } = useDashboardData();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleRestore = async (id: string) => {
    await restoreTransaction(id);
    setSelectedId(null);
  };

  const handleDeletePermanent = async (id: string) => {
    if (confirm('Tem certeza? Essa ação não pode ser desfeita.')) {
        await permanentDeleteTransaction(id);
        setSelectedId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0 bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-500/10 text-red-500">
                <Trash className="w-5 h-5" />
            </div>
            <div>
                <DialogTitle className="text-xl">Lixeira</DialogTitle>
                <DialogDescription>
                    Transações excluídas recentemente. Você pode restaurá-las ou removê-las permanentemente.
                </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-2">
            {deletedTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center">
                        <Trash className="w-8 h-8 opacity-50" />
                    </div>
                    <p>A lixeira está vazia</p>
                </div>
            ) : (
                <div className="space-y-3 pb-6">
                    <AnimatePresence>
                        {deletedTransactions.map((tx) => {
                             const MotionDiv = motion.div as any;
                             return (
                            <MotionDiv
                                key={tx.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 p-4">
                                    <div className={cn(
                                        "p-2.5 rounded-full shrink-0",
                                        tx.type === TransactionType.RECEITA 
                                            ? "bg-emerald-500/10 text-emerald-500" 
                                            : "bg-red-500/10 text-red-500"
                                    )}>
                                        {tx.type === TransactionType.RECEITA ? (
                                            <ArrowUpCircle className="w-5 h-5" />
                                        ) : (
                                            <ArrowDownCircle className="w-5 h-5" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium truncate">{tx.description}</span>
                                            <Badge variant="outline" className="text-xs h-5 px-1.5 opacity-70">
                                                {tx.category.name}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{formatDate(tx.date)}</span>
                                            <span>•</span>
                                            <span className={cn(
                                                "font-medium",
                                                tx.type === TransactionType.RECEITA ? "text-emerald-500" : "text-red-500"
                                            )}>
                                                {formatCurrency(tx.amount)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10"
                                            onClick={() => handleRestore(tx.id)}
                                            title="Restaurar"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                            onClick={() => handleDeletePermanent(tx.id)}
                                            title="Excluir Permanentemente"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </MotionDiv>
                        );})}
                    </AnimatePresence>
                </div>
            )}
        </ScrollArea>
        <DialogFooter className="p-4 border-t border-border/10">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
