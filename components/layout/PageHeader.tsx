import React from 'react';
import { ChevronDown } from '../Icons'; // Usaremos o Chevron para a direita

interface PageHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  breadcrumbs?: string[];
  actions?: React.ReactNode;
}

import { PrivacyToggle } from '../ui/PrivacyMask';

export const PageHeader: React.FC<PageHeaderProps> = ({ icon: Icon, title, breadcrumbs = [], actions }) => {
  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[oklch(var(--border-oklch))] pb-5 mb-6 flex-shrink-0">
      <div 
        className="absolute bottom-[-1px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        style={{ animation: 'pulse-border 3s ease-in-out infinite' }}
      />
      <div>
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-cyan-300" />
          <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
        </div>
        <div className="mt-2 flex items-center gap-x-2 text-sm text-gray-400">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb}>
              <span>{crumb}</span>
              {index < breadcrumbs.length - 1 && (
                <ChevronDown className="w-4 h-4 text-gray-500 -rotate-90" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
         <PrivacyToggle />
         {actions}
      </div>
    </div>
  );
};