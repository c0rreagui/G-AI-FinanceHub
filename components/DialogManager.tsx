import React from 'react';
import { useDialog } from '../hooks/useDialog';
import { SmartGoalWizard } from './goals/SmartGoalWizard';
import { AddDebtForm } from './forms/AddDebtForm';
import { AddTransactionForm } from './forms/AddTransactionForm';
import { AddSchedulingForm } from './forms/AddSchedulingForm';
import { AddValueToGoalForm } from './forms/AddValueToGoalForm';
import { AddPaymentToDebtForm } from './forms/AddPaymentToDebtForm';
import { ConfirmationModal } from './ui/ConfirmationModal';
import { BulkRecategorizeForm } from './forms/BulkRecategorizeForm';
import { AddExpenseDrawer } from './forms/AddExpenseDrawer';
import { AddIncomeDrawer } from './forms/AddIncomeDrawer';
import { AddInvestmentDrawer } from './forms/AddInvestmentDrawer';
import { AchievementsDialog } from './dashboard/AchievementsDialog';
import { ProfileAnalysisQuiz } from './onboarding/ProfileAnalysisQuiz';
import { ImportTransactionsDialog } from './forms/ImportTransactionsDialog';
import { TransactionCommentsDialog } from './social/TransactionCommentsDialog';
import { FinanceHubAIDialog } from './ui/FinanceHubAIDialog';
import { NotificationSheet } from './ui/NotificationSheet';

export const DialogManager: React.FC = () => {
  const { dialogType, closeDialog, dialogProps } = useDialog();

  switch (dialogType) {
    case 'notifications':
        return <NotificationSheet isOpen={true} onClose={closeDialog} />;
    case 'add-goal':
      return <SmartGoalWizard isOpen={true} onClose={closeDialog} {...dialogProps} />;
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
    case 'add-expense':
        return <AddExpenseDrawer isOpen={true} onClose={closeDialog} />;
    case 'add-income':
        return <AddIncomeDrawer isOpen={true} onClose={closeDialog} />;
    case 'add-investment':
        return <AddInvestmentDrawer isOpen={true} onClose={closeDialog} />;
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
    case 'import-transactions':
        return <ImportTransactionsDialog isOpen={true} onClose={closeDialog} />;
    case 'achievements':
        return <AchievementsDialog isOpen={true} onClose={closeDialog} />;
    case 'profile-quiz':
        return <ProfileAnalysisQuiz isOpen={true} onClose={closeDialog} />;
    case 'transaction-comments':
        return <TransactionCommentsDialog isOpen={true} onClose={closeDialog} transaction={dialogProps.transaction} />;
    case 'ai-chat':
        return <FinanceHubAIDialog isOpen={true} onClose={closeDialog} />;
    default:
      return null;
  }
};