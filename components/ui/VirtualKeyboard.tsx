import React from 'react';
import { Delete } from 'lucide-react';
import { triggerHapticFeedback } from '../../utils/haptics';

interface VirtualKeyboardProps {
    onPress: (key: string) => void;
    onDelete: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    className?: string;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ 
    onPress, 
    onDelete, 
    onConfirm,
    confirmText = 'OK',
    className 
}) => {
    
    const handlePress = (key: string) => {
        triggerHapticFeedback(10);
        onPress(key);
    };

    const handleDelete = () => {
        triggerHapticFeedback(15);
        onDelete();
    };

    const handleConfirm = () => {
        if (onConfirm) {
            triggerHapticFeedback(20);
            onConfirm();
        }
    };

    const Key = ({ value, label, span = 1, isAction = false, className: keyClassName }: { value: string, label?: React.ReactNode, span?: number, isAction?: boolean, className?: string }) => (
        <button
            onClick={() => isAction ? (value === 'del' ? handleDelete() : handleConfirm()) : handlePress(value)}
            className={`
                h-16 rounded-2xl flex items-center justify-center text-2xl font-semibold transition-all active:scale-95
                ${span === 2 ? 'col-span-2' : 'col-span-1'}
                ${isAction 
                    ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                    : 'bg-white/[0.03] text-white hover:bg-white/[0.06] active:bg-white/[0.08]'}
                ${keyClassName || ''}
            `}
        >
            {label || value}
        </button>
    );

    return (
        <div className={`grid grid-cols-3 gap-3 w-full max-w-sm mx-auto p-4 ${className}`}>
            <Key value="1" />
            <Key value="2" />
            <Key value="3" />
            <Key value="4" />
            <Key value="5" />
            <Key value="6" />
            <Key value="7" />
            <Key value="8" />
            <Key value="9" />
            <Key value="00" className="text-xl" />
            <Key value="0" />
            <Key value="del" label={<Delete className="w-6 h-6" />} isAction />
            
            {onConfirm && (
                <button
                    onClick={handleConfirm}
                    className="col-span-3 h-14 mt-2 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 active:scale-95 transition-all"
                >
                    {confirmText}
                </button>
            )}
        </div>
    );
};
