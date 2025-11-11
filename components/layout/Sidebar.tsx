import React from 'react';
import { ViewType } from '../../types';
import { 
    HomeIcon, 
    ArrowLeftRight, 
    Lightbulb,
    Target,
    TrendingDown,
    Calendar,
    Wrench,
    Settings,
} from '../Icons';
import { motion } from 'framer-motion';
import { APP_VERSION, APP_CODENAME } from '../../config';
import { useDashboardData } from '../../hooks/useDashboardData';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const navigation = [
  { name: 'Início', view: 'home', icon: HomeIcon },
  { name: 'Transações', view: 'transactions', icon: ArrowLeftRight },
  { name: 'Insights', view: 'insights', icon: Lightbulb },
  { name: 'Metas', view: 'goals', icon: Target },
  { name: 'Dívidas', view: 'debts', icon: TrendingDown },
  { name: 'Agendamentos', view: 'scheduling', icon: Calendar },
  { name: 'Ferramentas', view: 'tools', icon: Wrench },
];

const secondaryNavigation = [
    { name: 'Ajustes', view: 'settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { isMutating } = useDashboardData();
  return (
    <aside className="flex flex-col gap-y-5 overflow-y-auto bg-[oklch(var(--card-oklch)_/_0.5)] px-6 w-64 border-r border-[oklch(var(--border-oklch))] flex-shrink-0">
      <div className="flex h-20 shrink-0 items-center gap-2">
        <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
            FinanceHub
        </h1>
        {isMutating && (
           <div className="w-3 h-3">
             <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
           </div>
        )}
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <li key={item.name}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentView(item.view as ViewType);
                      }}
                      className={`
                        group relative flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                        ${isActive 
                          ? 'text-white bg-white/5' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {isActive && (
                         <motion.span 
                            layoutId="sidebar-active-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-cyan-400 rounded-r-full"
                          />
                      )}
                      <item.icon
                        className={`h-6 w-6 shrink-0 
                          ${isActive ? 'text-cyan-300' : 'text-gray-500 group-hover:text-white'}
                        `}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </li>
          <li className="mt-auto">
             <div className="text-xs text-white/20 pointer-events-none select-none mb-4">
                v{APP_VERSION} <span className="italic">({APP_CODENAME})</span>
            </div>
            <ul role="list" className="-mx-2 space-y-1">
              {secondaryNavigation.map((item) => {
                 const isActive = currentView === item.view;
                 return (
                  <li key={item.name}>
                      <a
                          href="#"
                          onClick={(e) => {
                              e.preventDefault();
                              setCurrentView(item.view as ViewType);
                          }}
                          className={`
                            group relative flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                            ${isActive
                              ? 'text-white bg-white/5'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }
                          `}
                      >
                         {isActive && (
                          <motion.span 
                            layoutId="sidebar-active-indicator-secondary"
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-cyan-400 rounded-r-full"
                          />
                        )}
                        <item.icon
                            className={`h-6 w-6 shrink-0
                              ${isActive ? 'text-cyan-300' : 'text-gray-500 group-hover:text-white'}
                            `}
                            aria-hidden="true"
                        />
                        {item.name}
                      </a>
                  </li>
                 )
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
};