// components/views/skeletons/TransactionsViewSkeleton.tsx
import React from 'react';
import { Skeleton } from '../../ui/skeletons/Skeleton';

const SkeletonItem = () => (
    <li className="flex items-center justify-between py-4 px-2">
        <div className="flex items-center gap-4 flex-1">
            <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
        <Skeleton className="h-6 w-20" />
    </li>
);

export const TransactionsViewSkeleton: React.FC = () => {
    return (
        <div className="mt-6 flex-grow">
            <ul className="divide-y divide-white/10">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)}
            </ul>
        </div>
    );
};