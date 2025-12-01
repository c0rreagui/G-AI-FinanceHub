import { useToast } from '../contexts/ToastContext';

export const useUndo = () => {
  const { showToast } = useToast();

  const showUndoToast = (message: string, onUndo: () => void) => {
    showToast(message, {
      type: 'success',
      action: {
        label: 'Desfazer',
        onClick: onUndo,
      },
    });
  };

  return { showUndoToast };
};
