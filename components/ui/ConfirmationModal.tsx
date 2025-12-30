// FIX: Implemented the ConfirmationModal component to provide a reusable confirmation dialog.
import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive';
  children: React.ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'default',
  children,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-gray-300">
        {children}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        <Button type="button" variant={confirmVariant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
