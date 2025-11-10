import React from 'react';
import { ViewType } from '../../types';
import {
    HomeIcon,
    ArrowLeftRight,
    Lightbulb,
    Target,
    PlusCircle,
} from '../Icons';
import { useDialog } from '../../hooks/useDialog';
import { motion } from 'framer-motion';

interface MobileBottomNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const navigation = [
  { name: 'Início', view: 'home', icon: HomeIcon },
  { name: 'Transações', view: 'transactions', icon: ArrowLeftRight },
  { name: 'Insights', view: 'insights', icon: Lightbulb },
  { name: 'Metas', view: 'goals', icon: Target },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, setCurrentView }) => {
  const { openDialog } = useDialog();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/30 backdrop-blur-xl border-t border-white/10 z-50">
      <div className="grid grid-cols-5 h-full">
        {navigation.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.name}
              onClick={() => setCurrentView(item.view as ViewType)}
              className="relative flex flex-col items-center justify-center gap-1 text-xs font-medium"
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
              <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="mobile-active-nav"
                  className="absolute bottom-0 h-1 w-8 bg-indigo-500 rounded-full"
                />
              )}
            </button>
          );
        })}
        {/* Central Action Button */}
        <div className="flex items-center justify-center">
             <button onClick={() => openDialog('add-transaction')} className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white shadow-lg -translate-y-4">
                <PlusCircle className="w-8 h-8" />
             </button>
        </div>
      </div>
    </div>
  );
};
