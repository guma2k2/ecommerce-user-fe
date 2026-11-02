'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Package, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, buttonVariants, Typography } from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/lib/utils';
import { useOrders } from '../hooks';
import { OrderCard } from './OrderCard';
import { OrderListSkeleton } from './OrderSkeleton';
import type { OrderStatus } from '../types';

export function OrderListContainer() {
  const { t } = useTranslation('orders');
  const [activeStatus, setActiveStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(0);

  const statusTabs: { label: string; value: OrderStatus | 'ALL' }[] = [
    { label: t('list.tabs.all'), value: 'ALL' },
    { label: t('list.tabs.pending'), value: 'PENDING' },
    { label: t('list.tabs.confirmed'), value: 'CONFIRMED' },
    { label: t('list.tabs.processing'), value: 'PROCESSING' },
    { label: t('list.tabs.shipping'), value: 'SHIPPING' },
    { label: t('list.tabs.delivered'), value: 'DELIVERED' },
    { label: t('list.tabs.cancelled'), value: 'CANCELLED' },
  ];

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
        <Typography.H1 className="text-2xl font-bold">{t('list.title')}</Typography.H1>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-border/60">
        {statusTabs.map((tab) => {
          const isActive = activeStatus === tab.value;
          return (
            <Button
              key={tab.value}
              type="button"
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                'rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 h-8 px-3.5',
                isActive
                  ? 'shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Content State Handling */}
      {isLoading ? (
        <OrderListSkeleton />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-3">
          <p className="text-sm text-destructive font-medium">{t('list.errorTitle')}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            {t('list.tryAgain')}
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Package className="size-7" />
          </div>
          <div className="space-y-1">
            <Typography.H3 className="font-semibold text-base">{t('list.emptyTitle')}</Typography.H3>
            <Typography.Muted className="text-xs max-w-sm mx-auto block">
              {activeStatus === 'ALL'
                ? t('list.emptyDesc')
                : `${t('list.emptyTitle')} (${activeStatus})`}
            </Typography.Muted>
          </div>
          {activeStatus === 'ALL' ? (
            <Link
              href={ROUTES.SHOP.CATALOG}
              className={cn(buttonVariants(), 'gap-2 text-xs')}
            >
              <ShoppingBag className="size-3.5" />
              <span>{t('list.browseCatalog')}</span>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTabChange('ALL')}
              className="text-xs"
            >
              {t('list.tabs.all')}
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
                {t('list.pageOf', { current: currentPage + 1, total: totalPages })}
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
                  <span>{t('list.prev')}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="gap-1 h-8"
                >
                  <span>{t('list.next')}</span>
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
