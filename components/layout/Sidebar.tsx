// FIX: Implemented the Sidebar component to resolve module errors and provide desktop navigation.
import React from 'react';
import { ViewType } from '../../types';
import { 
    HomeIcon, 
    ArrowLeftRight, 
    Lightbulb,
    Target,
    TrendingDown,
    Calendar,
    Tool,
    Settings,
} from '../Icons';

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
  { name: 'Ferramentas', view: 'tools', icon: Tool },
];

const secondaryNavigation = [
    { name: 'Ajustes', view: 'settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <div className="flex flex-col gap-y-5 overflow-y-auto bg-black/20 px-6 w-64 border-r border-white/10 flex-shrink-0">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            FinanceHub
        </h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView(item.view as ViewType);
                    }}
                    className={`
                      group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                      ${currentView === item.view 
                        ? 'bg-indigo-700/50 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <item.icon
                      className={`h-6 w-6 shrink-0 
                        ${currentView === item.view ? 'text-white' : 'text-gray-500 group-hover:text-white'}
                      `}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
             <div className="text-xs text-white/20 pointer-events-none select-none mb-4">
                FinanceHub v2.0.26
            </div>
            <ul role="list" className="-mx-2 space-y-1">
              {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                      <a
                          href="#"
                          onClick={(e) => {
                              e.preventDefault();
                              setCurrentView(item.view as ViewType);
                          }}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                            ${currentView === item.view
                              ? 'bg-indigo-700/50 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }
                          `}
                      >
                          <item.icon
                              className={`h-6 w-6 shrink-0
                                ${currentView === item.view ? 'text-white' : 'text-gray-500 group-hover:text-white'}
                              `}
                              aria-hidden="true"
                          />
                          {item.name}
                      </a>
                  </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};