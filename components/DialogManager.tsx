import React from 'react';
import { useDialog } from '../hooks/useDialog';
import { AddGoalForm } from './forms/AddGoalForm';
import { AddDebtForm } from './forms/AddDebtForm';

export const DialogManager: React.FC = () => {
  const { dialogType, closeDialog } = useDialog();

  switch (dialogType) {
    case 'add-goal':
      return <AddGoalForm isOpen={true} onClose={closeDialog} />;
    case 'add-debt':
      return <AddDebtForm isOpen={true} onClose={closeDialog} />;
    default:
      return null;
  }
};