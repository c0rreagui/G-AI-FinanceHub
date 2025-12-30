// components/views/skeletons/GenericViewSkeleton.tsx
import React from 'react';
import { Skeleton } from '../../ui/skeletons/Skeleton';

export const GenericViewSkeleton: React.FC = () => {
    return (
        <div className="mt-6 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
            </div>
        </div>
    );
};