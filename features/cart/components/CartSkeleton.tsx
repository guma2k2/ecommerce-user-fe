import React from 'react';
import { Skeleton } from '@/components/ui';

export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Items list skeleton */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <Skeleton className="h-6 w-32 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>

        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border/50 bg-card/50"
          >
            <Skeleton className="size-24 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2.5">
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/3 rounded-md" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary card skeleton */}
      <div className="lg:col-span-4 p-6 rounded-2xl border border-border/60 bg-card/60 space-y-5">
        <Skeleton className="h-6 w-40 rounded-md" />
        <div className="space-y-3 pt-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between border-t border-border/50 pt-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
