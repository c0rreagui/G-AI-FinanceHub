import React from 'react';
import { ViewType } from '../../types';
import { 
    HomeIcon, 
    BarChart as BarChartIcon,
    ArrowLeftRight,
    Target,
    TrendingDown
} from '../Icons';

interface MobileBottomNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const mobileNavigation = [
  { name: 'Início', view: 'home', icon: HomeIcon },
  { name: 'Dashboard', view: 'dashboard', icon: BarChartIcon },
  { name: 'Transações', view: 'transactions', icon: ArrowLeftRight },
  { name: 'Metas', view: 'goals', icon: Target },
  { name: 'Dívidas', view: 'debts', icon: TrendingDown },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, setCurrentView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="grid grid-cols-5 gap-x-2 max-w-lg mx-auto">
        {mobileNavigation.map((item) => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentView(item.view as ViewType);
            }}
            className={`
              flex flex-col items-center justify-center p-2 text-xs font-medium transition-colors
              ${currentView === item.view ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}
            `}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};
