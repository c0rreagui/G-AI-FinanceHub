import React from 'react';
import { ViewType } from '../../types';
import {
  HomeIcon,
  BarChart,
  ArrowLeftRight,
  Target,
  TrendingDown,
  Calendar,
  Tool,
  Settings,
  Lightbulb,
} from '../Icons';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabaseClient';

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
  { name: 'Configurações', view: 'settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { user } = useAuth();

  return (
    <aside className="flex w-64 flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/10">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-2xl font-bold text-white">FinanceHub</h1>
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
                      group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                      ${currentView === item.view
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
                    `}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
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
                        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                        ${currentView === item.view
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
                        `}
                    >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                    </a>
                    </li>
                ))}
            </ul>
            {/* CHORE: Update app version */}
            <div className="mt-4 border-t border-white/10 pt-4 text-center text-xs text-gray-500">
              <p>FinanceHub v2.0.11</p>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
};