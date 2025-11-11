import React from 'react';
import { useDialog } from '../hooks/useDialog';
import { AddGoalForm } from './forms/AddGoalForm';
import { AddDebtForm } from './forms/AddDebtForm';
import { AddTransactionForm } from './forms/AddTransactionForm';
import { AddSchedulingForm } from './forms/AddSchedulingForm';
import { AddValueToGoalForm } from './forms/AddValueToGoalForm';
import { AddPaymentToDebtForm } from './forms/AddPaymentToDebtForm';
import { ConfirmationModal } from './ui/ConfirmationModal';
import { BulkRecategorizeForm } from './forms/BulkRecategorizeForm';

export const DialogManager: React.FC = () => {
  const { dialogType, closeDialog, dialogProps } = useDialog();

  switch (dialogType) {
    case 'add-goal':
      return <AddGoalForm isOpen={true} onClose={closeDialog} {...dialogProps} />;
    case 'add-debt':
      return <AddDebtForm isOpen={true} onClose={closeDialog} {...dialogProps} />;
    case 'add-transaction':
      return <AddTransactionForm isOpen={true} onClose={closeDialog} {...dialogProps} />;
    case 'add-scheduling':
      return <AddSchedulingForm isOpen={true} onClose={closeDialog} {...dialogProps} />;
    case 'add-value-to-goal':
      return <AddValueToGoalForm isOpen={true} onClose={closeDialog} {...dialogProps} />;
    case 'add-payment-to-debt':
        return <AddPaymentToDebtForm isOpen={true} onClose={closeDialog} {...dialogProps} />;
    case 'confirmation':
        return <ConfirmationModal 
            isOpen={true} 
            onClose={closeDialog} 
            title={dialogProps.title}
            onConfirm={() => {
                dialogProps.onConfirm();
                closeDialog();
            }}
            confirmVariant={dialogProps.confirmVariant}
            confirmText={dialogProps.confirmText}
            >{dialogProps.message}</ConfirmationModal>
    case 'bulk-recategorize':
        return <BulkRecategorizeForm
            isOpen={true}
            onClose={closeDialog}
            {...dialogProps}
        />
    default:
      return null;
  }
};