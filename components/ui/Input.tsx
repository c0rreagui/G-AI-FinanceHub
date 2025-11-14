
// components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="group">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1.5 peer-disabled:opacity-50 transition-opacity">
        {label}
      </label>
      <div className="relative">
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-cyan-500 to-green-400 opacity-0 group-focus-within:opacity-75 blur transition duration-200" />
        <input
          id={id}
          {...props}
          className="relative peer block w-full bg-[oklch(var(--background-oklch))] border border-[oklch(var(--border-oklch))] rounded-lg shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[oklch(var(--primary-oklch))] focus:border-[oklch(var(--primary-oklch))] sm:text-sm transition disabled:opacity-50"
        />
      </div>
    </div>
  );
};
