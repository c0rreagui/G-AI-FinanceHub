// components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="mt-1 block w-full bg-black/20 border border-white/20 rounded-xl shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition disabled:opacity-50"
      />
    </div>
  );
};
