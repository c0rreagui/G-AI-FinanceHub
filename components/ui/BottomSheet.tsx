import React from 'react';
import { Drawer } from './Drawer';

interface BottomSheetProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ 
  trigger, 
  title, 
  description, 
  children, 
  footer,
  isOpen,
  onClose,
  open,
  onOpenChange
}) => {
  // Handle both controlled patterns
  const effectiveOpen = open ?? isOpen ?? false;
  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };

  // The existing Drawer component handles the mobile bottom sheet behavior internally
  return (
    <>
      {trigger && <div onClick={() => onOpenChange?.(true)}>{trigger}</div>}
      <Drawer
        isOpen={effectiveOpen}
        onClose={handleClose}
        title={title}
        footer={footer}
      >
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
        {children}
      </Drawer>
    </>
  );
};