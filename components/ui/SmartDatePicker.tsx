import React from 'react';
import { Input } from './Input';

interface SmartDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

