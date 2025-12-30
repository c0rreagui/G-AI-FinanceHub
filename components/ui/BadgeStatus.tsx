import React from 'react';
import { cn } from '@/utils/utils';
import { Badge } from './Badge';

interface BadgeStatusProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  children: React.ReactNode;
  className?: string;
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

export const BadgeStatus: React.FC<BadgeStatusProps> = ({ status, children, className }) => {
  return (
    <Badge variant="outline" className={cn("pl-2 pr-2.5 py-0.5 gap-1.5", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", statusColors[status])} />
      {children}
    </Badge>
  );
};
