import React from 'react';

interface PageHeaderProps {
  icon: React.ElementType;
  title: string;
  breadcrumbs: string[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ icon: Icon, title, breadcrumbs, actions }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-x-3">
            <Icon className="h-8 w-8 text-indigo-400" aria-hidden="true" />
            <h1 className="text-2xl font-bold leading-7 text-white">{title}</h1>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          {breadcrumbs.join(' / ')}
        </p>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
};
