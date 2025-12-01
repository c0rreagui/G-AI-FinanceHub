import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { TransactionComments } from './TransactionComments';
import { Transaction } from '../../types';

interface TransactionCommentsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction;
}

export const TransactionCommentsDialog: React.FC<TransactionCommentsDialogProps> = ({ isOpen, onClose, transaction }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Comentários: {transaction.description}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <TransactionComments transactionId={transaction.id} />
                </div>
            </DialogContent>
        </Dialog>
    );
};
