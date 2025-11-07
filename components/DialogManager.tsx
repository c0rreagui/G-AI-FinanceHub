import React from 'react';
import { useDialog } from '../hooks/useDialog';
import { AddGoalForm } from './forms/AddGoalForm';
import { AddDebtForm } from './forms/AddDebtForm';
import { AddTransactionForm } from './forms/AddTransactionForm';

export const DialogManager: React.FC = () => {
  // FIX: Destructure dialogProps to pass them to the forms.
  const { dialogType, closeDialog, dialogProps } = useDialog();

  switch (dialogType) {
    case 'add-goal':
      // FIX: Spread dialogProps to the component.
      return <AddGoalForm isOpen={true} onClose={closeDialog} {...dialogProps} />;
    case 'add-debt':
      // FIX: Spread dialogProps to the component.
      return <AddDebtForm isOpen={true} onClose={closeDialog} {...dialogProps} />;
    case 'add-transaction':
      // FIX: Spread dialogProps to the component.
      return <AddTransactionForm isOpen={true} onClose={closeDialog} {...dialogProps} />;
    default:
      return null;
  }
};
