import React from 'react';

interface PageHeaderProps {
  icon: React.ElementType;
  title: string;
  breadcrumbs: string[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ icon: Icon, title, breadcrumbs, actions }) => {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 flex-shrink-0">
      <div>
        <div className="flex items-center gap-x-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 shadow-inner">
                <Icon className="h-7 w-7 text-indigo-300" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">{title}</h1>
              <p className="mt-1 text-sm text-gray-400">
                {breadcrumbs.join(' › ')}
              </p>
            </div>
        </div>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
};
