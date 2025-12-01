import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/utils';

interface Tab {
  id: string;
  label: string;
}

interface TabsSliderProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export const TabsSlider: React.FC<TabsSliderProps> = ({ tabs, defaultTab, onChange, className }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  return (
    <div className={cn("flex space-x-1 rounded-xl bg-muted/50 p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={cn(
            "relative rounded-lg px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2",
            activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="bubble"
              className="absolute inset-0 z-10 bg-background shadow-sm rounded-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-20">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
