import React, { useState } from 'react';
import { Button, ButtonProps } from './Button';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/utils/utils';

interface ClipboardButtonProps extends ButtonProps {
  value: string;
  label?: string;
  onCopy?: () => void;
}

export const ClipboardButton: React.FC<ClipboardButtonProps> = ({ 
  value, 
  label, 
  onCopy,
  className,
  variant = "outline",
  size = "icon",
  ...props 
}) => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setHasCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("transition-all duration-200", className)}
      onClick={handleCopy}
      {...props}
    >
      {hasCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground" />
      )}
      {label && <span className="ml-2">{hasCopied ? 'Copiado!' : label}</span>}
    </Button>
  );
};
