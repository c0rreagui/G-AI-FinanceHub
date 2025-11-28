// components/views/skeletons/HomeDashboardSkeleton.tsx
import React from 'react';
import { Skeleton } from '../../ui/skeletons/Skeleton';

export const HomeDashboardSkeleton: React.FC = () => {
  return (
    <div className="mt-6 flex-grow space-y-6">
      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>

      {/* Goal Progress Skeleton */}
      <Skeleton className="h-40 rounded-2xl" />
    </div>
  );
};