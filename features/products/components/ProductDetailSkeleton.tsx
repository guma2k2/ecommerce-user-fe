import React from 'react';
import { Skeleton } from '@/components/ui';

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-64 bg-muted/60 rounded-md" />

      {/* Main Grid: Gallery + Purchase Panel with 2:3 ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 lg:gap-8">
        {/* Gallery */}
        <div className="space-y-4">
          <Skeleton className="aspect-[4/3] max-h-[420px] w-full rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="size-20 rounded-2xl" />
            <Skeleton className="size-20 rounded-2xl" />
            <Skeleton className="size-20 rounded-2xl" />
          </div>
        </div>

        {/* Purchase Panel */}
        <div className="space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-10 w-3/4 rounded-xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />

          {/* Options */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-28 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-xl" />
              <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-32 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28 rounded-xl" />
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );
}
