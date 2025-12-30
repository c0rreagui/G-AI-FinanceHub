import React, { useRef, useState } from 'react';
import { cn } from '@/utils/utils';
import { Input } from './Input';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete, className }) => {
  const [code, setCode] = useState<string[]>(new Array(length).fill(''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const processInput = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const num = e.target.value;
    if (/[^0-9]/.test(num)) return;

    const newCode = [...code];
    newCode[slot] = num.slice(-1); // Take only the last character
    setCode(newCode);

    if (slot < length - 1 && num) {
      inputs.current[slot + 1]?.focus();
    }

    if (newCode.every(c => c !== '')) {
      onComplete(newCode.join(''));
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: number) => {
    if (e.key === 'Backspace' && !code[slot] && slot > 0) {
      inputs.current[slot - 1]?.focus();
    }
  };

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {code.map((c, idx) => (
        <Input
          key={idx}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={c}
          autoFocus={idx === 0}
          onChange={(e) => processInput(e, idx)}
          onKeyUp={(e) => onKeyUp(e, idx)}
          ref={(ref) => inputs.current[idx] = ref}
          className="w-12 h-14 text-center text-xl font-bold bg-secondary/30 border-white/10 focus:border-primary focus:ring-primary/50"
        />
      ))}
    </div>
  );
};
