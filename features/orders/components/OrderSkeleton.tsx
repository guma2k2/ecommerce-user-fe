'use client';

import React from 'react';
import { Card, CardContent, CardHeader, Skeleton } from '@/components/ui';

export function OrderListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-border/80">
          <CardHeader className="py-4 border-b border-border/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function OrderDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-7 w-48" />
      </div>

      <Card className="border-border/80 p-6">
        <Skeleton className="h-16 w-full rounded-lg" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/80 p-6 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
        </Card>
        <Card className="border-border/80 p-6 space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-44" />
        </Card>
      </div>

      <Card className="border-border/80 p-6 space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="size-16 rounded-md" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
