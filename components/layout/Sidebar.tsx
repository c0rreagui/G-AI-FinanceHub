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
import { APP_VERSION } from '../../config';

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
  return (
    <aside className="flex flex-col gap-y-5 overflow-y-auto bg-black/25 backdrop-blur-md px-6 w-64 border-r border-white/10 flex-shrink-0">
      <div className="flex h-20 shrink-0 items-center">
        <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
            FinanceHub
        </h1>
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
                        group relative flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                        ${isActive 
                          ? 'text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-indicator"
                          className="absolute inset-0 bg-gradient-to-r from-indigo-600/70 to-purple-600/70 rounded-lg shadow-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <div className="relative flex items-center gap-x-3">
                        <item.icon
                          className={`h-6 w-6 shrink-0 
                            ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}
                          `}
                          aria-hidden="true"
                        />
                        {item.name}
                      </div>
                    </a>
                  </li>
                )
              })}
            </ul>
          </li>
          <li className="mt-auto">
             <div className="text-xs text-white/20 pointer-events-none select-none mb-4">
                FinanceHub v{APP_VERSION}
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
                            group relative flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                            ${isActive
                              ? 'text-white'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }
                          `}
                      >
                         {isActive && (
                          <motion.div
                            layoutId="active-nav-indicator-secondary"
                            className="absolute inset-0 bg-gradient-to-r from-indigo-600/70 to-purple-600/70 rounded-lg shadow-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <div className="relative flex items-center gap-x-3">
                          <item.icon
                              className={`h-6 w-6 shrink-0
                                ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}
                              `}
                              aria-hidden="true"
                          />
                          {item.name}
                        </div>
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