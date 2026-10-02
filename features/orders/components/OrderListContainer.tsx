'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/lib/utils';
import { useOrders } from '../hooks';
import { OrderCard } from './OrderCard';
import { OrderListSkeleton } from './OrderSkeleton';
import type { OrderStatus } from '../types';

const STATUS_TABS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'All Orders', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipping', value: 'SHIPPING' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export function OrderListContainer() {
  const [activeStatus, setActiveStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { data, isLoading, isError, refetch } = useOrders({
    status: activeStatus,
    pageNumber: currentPage,
    pageSize: 10,
  });

  const orders = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleTabChange = (status: OrderStatus | 'ALL') => {
    setActiveStatus(status);
    setCurrentPage(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Order History</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Track, manage, and review all your purchases and delivery statuses.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-border/60">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatus === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content State Handling */}
      {isLoading ? (
        <OrderListSkeleton />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-3">
          <p className="text-sm text-destructive font-medium">Failed to load orders.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Package className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-base text-foreground">No orders found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {activeStatus === 'ALL'
                ? "You haven't placed any orders yet. Discover our catalog to get started!"
                : `You don't have any orders with status "${activeStatus}".`}
            </p>
          </div>
          {activeStatus === 'ALL' ? (
            <Link
              href={ROUTES.SHOP.CATALOG}
              className={cn(buttonVariants(), 'gap-2 text-xs')}
            >
              <ShoppingBag className="size-3.5" />
              <span>Start Shopping</span>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTabChange('ALL')}
              className="text-xs"
            >
              View All Orders
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onRefresh={() => refetch()} />
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs text-muted-foreground">
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className="gap-1 h-8"
                >
                  <ChevronLeft className="size-4" />
                  <span>Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="gap-1 h-8"
                >
                  <span>Next</span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
