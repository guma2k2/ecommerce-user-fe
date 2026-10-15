import React from 'react';
import { Skeleton } from '@/components/ui';

export function SearchProductCardSkeleton() {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-border/60 bg-card/40 p-0 shadow-2xs">
      <div>
        <Skeleton className="aspect-square w-full rounded-none" />
        <div className="p-2.5 space-y-1.5">
          <Skeleton className="h-3.5 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="p-2.5 pt-0 flex items-center justify-between border-t border-border/30 mt-1 pt-2">
        <div className="space-y-1">
          <Skeleton className="h-2.5 w-8 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <Skeleton className="size-7 rounded-lg" />
      </div>
    </div>
  );
}
