import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { useDashboardData } from '../../hooks/useDashboardData';
import { TransactionStatus } from '../../types';
import { SmartDatePicker } from '../ui/SmartDatePicker';

interface BulkEditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedIds: string[];
    onSuccess: () => void;
}

export const BulkEditDialog: React.FC<BulkEditDialogProps> = ({ isOpen, onClose, selectedIds, onSuccess }) => {
    const { categories, accounts, bulkUpdateTransactions } = useDashboardData();
    const [categoryId, setCategoryId] = useState<string>('');
    const [accountId, setAccountId] = useState<string>('');
    const [status, setStatus] = useState<TransactionStatus | ''>('');
    const [date, setDate] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            const updates: any = {};
            if (categoryId) updates.category_id = categoryId;
            if (accountId) updates.account_id = accountId;
            if (status) updates.status = status;
            if (date) updates.date = new Date(date).toISOString();

            if (Object.keys(updates).length > 0) {
                await bulkUpdateTransactions(selectedIds, updates);
                onSuccess();
                onClose();
            } else {
                onClose();
            }
        } catch (error) {
            console.error("Failed to bulk update", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar {selectedIds.length} Transações</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Categoria</label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Manter atual" />
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

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Conta</label>
                        <Select value={accountId} onValueChange={setAccountId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Manter atual" />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts.map((acc) => (
                                    <SelectItem key={acc.id} value={acc.id}>
                                        {acc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select value={status} onValueChange={(v) => setStatus(v as TransactionStatus)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Manter atual" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={TransactionStatus.COMPLETED}>Concluído</SelectItem>
                                <SelectItem value={TransactionStatus.PENDING}>Pendente</SelectItem>
                                <SelectItem value={TransactionStatus.SCHEDULED}>Agendado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <SmartDatePicker 
                            label="Data"
                            value={date}
                            onChange={setDate}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
