import React, { useState, useEffect, useRef } from 'react';
import { Calculator } from 'lucide-react';

interface SmartInputProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    prefix?: string;
    autoFocus?: boolean;
    className?: string;
    readOnly?: boolean;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

export const SmartInput: React.FC<SmartInputProps> = ({ 
    value, 
    onChange, 
    label, 
    placeholder = "0,00", 
    prefix = "R$", 
    autoFocus,
    className,
    readOnly,
    inputMode
}) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [isMathMode, setIsMathMode] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    const handleBlur = () => {
        // Try to evaluate math expression
        if (displayValue.match(/[+\-*/]/)) {
            try {
                // Safe eval for simple math
                 
                const result = new Function('return ' + displayValue.replace(',', '.').replace(/[^\d.+\-*/]/g, ''))();
                if (!Number.isNaN(result) && isFinite(result)) {
                    const formatted = result.toFixed(2);
                    onChange(formatted);
                    setDisplayValue(formatted);
                    setIsMathMode(false);
                    return;
                }
            } catch (e) {
                // Invalid expression, revert or keep as is
            }
        }
        onChange(displayValue);
        setIsMathMode(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDisplayValue(val);
        
        // Detect math characters
        if (val.match(/[+\-*/]/)) {
            setIsMathMode(true);
        } else {
            setIsMathMode(false);
            onChange(val);
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && <label className="text-sm font-medium text-slate-400">{label}</label>}
            <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg transition-colors ${isMathMode ? 'text-violet-400' : 'text-muted-foreground'}`}>
                    {isMathMode ? <Calculator className="w-6 h-6" /> : prefix}
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    inputMode={inputMode || (isMathMode ? "text" : "decimal")}
                    readOnly={readOnly}
                    value={displayValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className={`w-full bg-background/50 border rounded-xl py-4 pl-12 pr-4 text-2xl font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all ${
                        isMathMode 
                            ? 'border-violet-500/50 focus:ring-violet-500/50 text-violet-200' 
                            : 'border-input bg-secondary/10 focus:ring-primary/50 focus:border-primary'
                    }`}
                />
                {isMathMode && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-violet-400 font-medium px-2 py-1 bg-violet-500/10 rounded">
                        Calculando...
                    </div>
                )}
            </div>
        </div>
    );
};
