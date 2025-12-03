import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Trash2, Edit, CheckCircle, X } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { BulkEditDialog } from './BulkEditDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog';

interface BulkActionsBarProps {
    selectedIds: string[];
    onClearSelection: () => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({ selectedIds, onClearSelection }) => {
    const { bulkDeleteTransactions, bulkUpdateTransactions } = useDashboardData();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    if (selectedIds.length === 0) return null;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await bulkDeleteTransactions(selectedIds);
            onClearSelection();
            setIsDeleteOpen(false);
        } catch (error) {
            console.error("Failed to delete", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleConciliate = async () => {
        try {
            await bulkUpdateTransactions(selectedIds, { reconciled: true });
            onClearSelection();
        } catch (error) {
            console.error("Failed to conciliate", error);
        }
    };

    return (
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 z-50"
                >
                    <span className="text-sm font-medium text-muted-foreground border-r border-border pr-4">
                        {selectedIds.length} selecionados
                    </span>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)} className="hover:bg-muted/50">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                        </Button>
                        
                        <Button variant="ghost" size="sm" onClick={handleConciliate} className="hover:bg-muted/50 text-emerald-500 hover:text-emerald-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Conciliar
                        </Button>

                        <Button variant="ghost" size="sm" onClick={() => setIsDeleteOpen(true)} className="hover:bg-red-500/10 text-red-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                        </Button>
                    </div>

                    <Button variant="ghost" size="icon" onClick={onClearSelection} className="ml-2 rounded-full h-8 w-8">
                        <X className="w-4 h-4" />
                    </Button>
                </motion.div>
            </AnimatePresence>

            <BulkEditDialog 
                isOpen={isEditOpen} 
                onClose={() => setIsEditOpen(false)} 
                selectedIds={selectedIds}
                onSuccess={onClearSelection}
            />

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir {selectedIds.length} transações?</DialogTitle>
                        <DialogDescription>
                            Esta ação não pode ser desfeita. As transações serão removidas permanentemente.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? 'Excluindo...' : 'Excluir'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
