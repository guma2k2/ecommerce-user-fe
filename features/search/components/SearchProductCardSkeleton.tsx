import React from 'react';
import { Skeleton } from '@/components/ui';

export function SearchProductCardSkeleton() {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-0 shadow-xs">
      <div>
        <Skeleton className="aspect-square w-full rounded-none" />
        <div className="p-4 space-y-2.5">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="p-4 pt-0 flex items-center justify-between border-t border-border/40 mt-3 pt-3">
        <div className="space-y-1">
          <Skeleton className="h-3 w-10 rounded" />
          <Skeleton className="h-5 w-24 rounded" />
        </div>
        <Skeleton className="size-8.5 rounded-xl" />
      </div>
    </div>
  );
}
