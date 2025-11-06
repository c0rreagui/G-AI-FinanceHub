import React from 'react';
import { ViewType } from '../../types';
import { 
    HomeIcon, 
    BarChart as BarChartIcon,
    ArrowLeftRight,
    Lightbulb,
    Target,
    TrendingDown,
    Calendar,
    Tool,
    Settings
} from '../Icons';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const navigation = [
  { name: 'Início (IA)', view: 'home', icon: HomeIcon },
  { name: 'Dashboard', view: 'dashboard', icon: BarChartIcon },
  { name: 'Transações', view: 'transactions', icon: ArrowLeftRight },
  { name: 'Insights', view: 'insights', icon: Lightbulb },
  { name: 'Metas', view: 'goals', icon: Target },
  { name: 'Dívidas', view: 'debts', icon: TrendingDown },
];

const secondaryNavigation = [
    { name: 'Agendamentos', view: 'scheduling', icon: Calendar },
    { name: 'Ferramentas', view: 'tools', icon: Tool },
    { name: 'Configurações', view: 'settings', icon: Settings },
]

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <div className="flex flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5 w-64">
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
                      ${item.view === currentView ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
                      group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                    `}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
           <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">Outras Ferramentas</div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {secondaryNavigation.map((item) => (
                 <li key={item.name}>
                 <a
                   href="#"
                   onClick={(e) => {
                       e.preventDefault();
                       setCurrentView(item.view as ViewType);
                   }}
                   className={`
                      ${item.view === currentView ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
                      group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                   `}
                 >
                   <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
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
