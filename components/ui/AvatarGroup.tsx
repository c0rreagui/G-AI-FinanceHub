import React from 'react';
import { cn } from '@/utils/utils';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';

interface AvatarGroupProps {
  users: { name: string; image?: string }[];
  max?: number;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, max = 3, className }) => {
  const visibleUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className={cn("flex -space-x-3 overflow-hidden", className)}>
      {visibleUsers.map((user, i) => (
        <Avatar key={i} className="inline-block border-2 border-background ring-2 ring-background">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted ring-2 ring-background">
          <span className="text-xs font-medium">+{remaining}</span>
        </div>
      )}
    </div>
  );
};
