import React from 'react';

interface PageHeaderProps {
  icon: React.ElementType;
  title: string;
  breadcrumbs: string[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ icon: Icon, title, breadcrumbs, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[oklch(var(--border-oklch))] pb-5 mb-6 flex-shrink-0">
      <div>
        <div className="flex items-center gap-3">
          <Icon className="w-8 h-8 text-cyan-300" />
          <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
        </div>
        <div className="mt-2 flex items-center gap-x-2 text-sm text-gray-400">
          {breadcrumbs.join(' / ')}
        </div>
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
};
