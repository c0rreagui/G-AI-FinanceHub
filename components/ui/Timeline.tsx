import React from 'react';
import { cn } from '@/utils/utils';

interface TimelineItemProps {
  title: string;
  date: string;
  description?: string;
  icon?: React.ReactNode;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ title, date, description, icon, isLast }) => {
  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {!isLast && (
        <div className="absolute left-[11px] top-[24px] bottom-0 w-px bg-border" />
      )}
      <div className="absolute left-0 top-1 h-6 w-6 rounded-full border bg-background flex items-center justify-center ring-4 ring-background">
        {icon || <div className="h-2 w-2 rounded-full bg-primary" />}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{date}</span>
        <h4 className="text-sm font-semibold leading-none">{title}</h4>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
    </div>
  );
};

export const Timeline: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
};
