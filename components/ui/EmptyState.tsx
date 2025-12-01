

// components/ui/EmptyState.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode; // Para o botão de ação
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, children }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-400 py-16 h-full rounded-2xl bg-gradient-to-t from-black/10 via-transparent to-transparent">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        {...({ className: "w-16 h-16 flex items-center justify-center rounded-full bg-white/5 mb-4" } as any)}
      >
        <Icon className="w-8 h-8 text-gray-500" />
      </motion.div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-xs text-sm">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};