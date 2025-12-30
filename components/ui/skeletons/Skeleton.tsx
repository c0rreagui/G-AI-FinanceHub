// components/ui/skeletons/Skeleton.tsx
import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/10 ${className}`}
      {...props}
    />
  );
};