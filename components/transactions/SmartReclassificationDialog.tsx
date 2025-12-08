import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Input } from '../ui/Input';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { formatCurrency } from '../../utils/formatters';
import { ArrowRight, Filter, AlertCircle } from 'lucide-react';
import { Transaction } from '../../types';

interface SmartReclassificationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const SmartReclassificationDialog: React.FC<SmartReclassificationDialogProps> = ({ isOpen, onClose, onSuccess }) => {
    const { transactions, categories, bulkUpdateTransactions } = useDashboardData();
    const [keyword, setKeyword] = useState('');
    const [targetCategoryId, setTargetCategoryId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Preview logic
    const matchingTransactions = useMemo(() => {
        if (!keyword || keyword.length < 3) return [];
        return transactions.filter(t => 
            t.description.toLowerCase().includes(keyword.toLowerCase()) &&
            t.category_id !== targetCategoryId
        );
    }, [transactions, keyword, targetCategoryId]);

    const handleApply = async () => {
        if (!targetCategoryId || matchingTransactions.length === 0) return;
        
        setIsSubmitting(true);
        try {
            const ids = matchingTransactions.map(t => t.id);
            await bulkUpdateTransactions(ids, { category_id: targetCategoryId });
            onSuccess();
            onClose();
            setKeyword('');
            setTargetCategoryId('');
        } catch (error) {
            console.error("Failed to reclassify", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const targetCategory = categories.find(c => c.id === targetCategoryId);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-primary" />
                        Reclassificação Inteligente
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Rule Definition */}
                    <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end bg-muted/30 p-4 rounded-lg border border-border/50">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Se a descrição contém:</label>
                            <Input 
                                placeholder="Ex: Uber, Netflix..." 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                        
                        <div className="pb-3 text-muted-foreground">
                            <ArrowRight className="w-5 h-5" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mudar categoria para:</label>
                            <Select value={targetCategoryId} onValueChange={setTargetCategoryId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            <div className="flex items-center gap-2">
                                                {cat.icon && <cat.icon className="w-4 h-4" style={{ color: cat.color }} />}
                                                {cat.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-muted-foreground">
                                Pré-visualização ({matchingTransactions.length} encontradas)
                            </h4>
                            {matchingTransactions.length > 0 && targetCategory && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    Serão movidas para <strong>{targetCategory.name}</strong>
                                </span>
                            )}
                        </div>
                        
                        <div className="border rounded-md h-[300px] overflow-auto relative">
                            {matchingTransactions.length > 0 ? (
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background z-10">
                                        <TableRow>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Descrição</TableHead>
                                            <TableHead>Categoria Atual</TableHead>
                                            <TableHead className="text-right">Valor</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {matchingTransactions.map(tx => {
                                            const currentCat = categories.find(c => c.id === tx.category_id);
                                            return (
                                                <TableRow key={tx.id}>
                                                    <TableCell className="text-xs text-muted-foreground">
                                                        {new Date(tx.date).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="font-medium">{tx.description}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-xs">
                                                            {currentCat?.icon && <currentCat.icon className="w-3 h-3" style={{ color: currentCat.color }} />}
                                                            {currentCat?.name || 'Sem categoria'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right text-xs">
                                                        {formatCurrency(tx.amount)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                                    <AlertCircle className="w-8 h-8 opacity-20" />
                                    <p className="text-sm">
                                        {keyword.length < 3 
                                            ? "Digite pelo menos 3 letras para buscar." 
                                            : "Nenhuma transação encontrada com este termo."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button 
                        onClick={handleApply} 
                        disabled={isSubmitting || matchingTransactions.length === 0 || !targetCategoryId}
                    >
                        {isSubmitting ? 'Aplicando...' : `Reclassificar ${matchingTransactions.length} Transações`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
