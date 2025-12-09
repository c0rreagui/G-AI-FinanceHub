import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Trash2, Edit, CheckCircle, X, Merge } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { BulkEditDialog } from './BulkEditDialog';
import { MergeDialog } from './MergeDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useDialog } from '../../hooks/useDialog';
import { TransactionStatus } from '@/types';

interface BulkActionsBarProps {
    selectedIds: string[];
    onClearSelection: () => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({ selectedIds, onClearSelection }) => {
    const { bulkDeleteTransactions, bulkUpdateTransactions } = useDashboardData();
    const { openDialog } = useDialog();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isMergeOpen, setIsMergeOpen] = useState(false);

    if (selectedIds.length === 0) return null;

    const handleDeleteClick = () => {
        openDialog('confirmation', {
            title: `Excluir ${selectedIds.length} transações?`,
            message: 'Esta ação não pode ser desfeita. As transações serão removidas permanentemente.',
            confirmText: 'Excluir',
            confirmVariant: 'destructive',
            onConfirm: async () => {
                await bulkDeleteTransactions(selectedIds);
                onClearSelection();
            },
        });
    };

    const handleConciliate = async () => {
        try {
            await bulkUpdateTransactions(selectedIds, { status: TransactionStatus.COMPLETED });
            onClearSelection();
        } catch (error) {
            console.error("Failed to conciliate", error);
        }
    };
    
    // Workaround for framer-motion type issue
    const MotionDiv = motion.div as any;

    return (
        <>
            <AnimatePresence>
                <MotionDiv
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 z-[80]"
                >
                    <span className="text-sm font-medium text-muted-foreground border-r border-border pr-4">
                        {selectedIds.length} selecionados
                    </span>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)} className="hover:bg-muted/50">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                        </Button>
                        
                        <Button variant="ghost" size="sm" onClick={() => setIsMergeOpen(true)} className="hover:bg-muted/50 text-purple-500 hover:text-purple-600">
                            <Merge className="w-4 h-4 mr-2" />
                            Unificar
                        </Button>

                        <Button variant="ghost" size="sm" onClick={handleConciliate} className="hover:bg-muted/50 text-emerald-500 hover:text-emerald-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Conciliar
                        </Button>

                        <Button variant="ghost" size="sm" onClick={handleDeleteClick} className="hover:bg-red-500/10 text-red-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                        </Button>
                    </div>

                    <Button variant="ghost" size="icon" onClick={onClearSelection} className="ml-2 rounded-full h-8 w-8">
                        <X className="w-4 h-4" />
                    </Button>
                </MotionDiv>
            </AnimatePresence>

            <BulkEditDialog 
                isOpen={isEditOpen} 
                onClose={() => setIsEditOpen(false)} 
                selectedIds={selectedIds}
                onSuccess={onClearSelection}
            />

            <MergeDialog 
                isOpen={isMergeOpen} 
                onClose={() => setIsMergeOpen(false)} 
                transactionIds={selectedIds}
                onComplete={onClearSelection}
            />


        </>
    );
};
