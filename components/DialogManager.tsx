import React from 'react';
import { useDialog } from '../hooks/useDialog';
import { AddGoalForm } from './forms/AddGoalForm';
import { AddDebtForm } from './forms/AddDebtForm';
import { AddTransactionForm } from './forms/AddTransactionForm';
import { AddSchedulingForm } from './forms/AddSchedulingForm';
import { AddValueToGoalForm } from './forms/AddValueToGoalForm';

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
    default:
      return null;
  }
};