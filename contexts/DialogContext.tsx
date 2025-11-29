import React, { createContext, useState } from 'react';

type DialogType = 'add-goal' | 'add-debt' | 'add-transaction' | 'add-scheduling' | 'add-value-to-goal' | 'add-payment-to-debt' | 'confirmation' | 'bulk-recategorize' | 'achievements' | 'profile-quiz' | null;

interface DialogContextType {
  dialogType: DialogType;
  dialogProps: any;
  openDialog: (type: DialogType, props?: any) => void;
  closeDialog: () => void;
}

export const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [dialogProps, setDialogProps] = useState<any>({});

  const openDialog = (type: DialogType, props: any = {}) => {
    setDialogType(type);
    setDialogProps(props);
  };

  const closeDialog = () => {
    setDialogType(null);
    setDialogProps({});
  };

  return (
    <DialogContext.Provider value={{ dialogType, dialogProps, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};
