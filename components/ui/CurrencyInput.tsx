import React, { useState, useEffect } from 'react';
import { Input } from './Input';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ value, onChange, label, ...props }) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    setDisplayValue(formatCurrency(value));
  }, [value]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numberValue = Number(rawValue) / 100;
    onChange(numberValue);
  };

  return (
    <Input
      {...props}
      label={label}
      value={displayValue}
      onChange={handleChange}
      inputMode="numeric"
    />
  );
};
