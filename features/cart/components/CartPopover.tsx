'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ShoppingBag, ArrowRight } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  buttonVariants,
} from '@/components/ui';
import { cn } from 'cn';
import { useCart } from '../hooks';
import { ROUTES } from '@/shared/constants';
import { formatCurrency } from '@/shared/utils';

interface CartPopoverProps {
  className?: string;
}

export function CartPopover({ className = '' }: CartPopoverProps) {
  const { items, totalQuantity, totalPrice } = useCart();
  const [open, setOpen] = useState(false);

  // Shopee displays up to 5 latest items in the hover popover
  const displayedItems = items.slice(0, 5);
  const remainingCount = totalQuantity > displayedItems.length ? totalQuantity - displayedItems.length : 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        openOnHover
        delay={80}
        closeDelay={180}
        nativeButton={false}
        render={
          <Link
            href={ROUTES.SHOP.CART}
            aria-label="Shopping Cart"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'relative rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer',
              className
            )}
          >
            <ShoppingCart className="size-5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-xs animate-in zoom-in-50">
                {totalQuantity > 99 ? '99+' : totalQuantity}
              </span>
            )}
          </Link>
        }
      />

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={10}
        showArrow={true}
        className="w-[380px] sm:w-[400px] p-0 shadow-2xl rounded-2xl overflow-hidden border border-border/80 bg-popover text-popover-foreground animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Shopee-style Header */}
        <div className="bg-muted/30 px-4 py-2.5 border-b border-border/60 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Recently Added Products
          </span>
          {totalQuantity > 0 && (
            <span className="text-[11px] font-semibold text-muted-foreground">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {/* Content Body */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-3">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground shadow-2xs">
              <ShoppingBag className="size-8 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Your shopping cart is empty</p>
              <p className="text-xs text-muted-foreground max-w-[240px]">
                Browse our trending catalog and discover great deals today!
              </p>
            </div>
            <Link href={ROUTES.SHOP.CATALOG} onClick={() => setOpen(false)}>
              <Button size="sm" variant="outline" className="rounded-xl text-xs font-semibold mt-1">
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Scrollable Products List */}
            <div className="max-h-[320px] overflow-y-auto divide-y divide-border/40 overscroll-contain">
              {displayedItems.map((item) => {
                const productUrl = ROUTES.SHOP.PRODUCT_DETAIL(
                  item.variant.productSlug || String(item.variant.productId)
                );
                return (
                  <Link
                    key={item.cartId}
                    href={productUrl}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors group cursor-pointer"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative size-12 rounded-lg bg-muted/60 overflow-hidden border border-border/60 shrink-0">
                      {item.variant.thumbnailUrl ? (
                        <Image
                          src={item.variant.thumbnailUrl}
                          alt={item.variant.productName}
                          fill
                          sizes="48px"
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-[10px] text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {item.variant.productName}
                      </p>
                      {item.variant.options && item.variant.options.length > 0 ? (
                        <p className="text-[10px] text-muted-foreground truncate">
                          {item.variant.options.map((opt) => `${opt.name}: ${opt.value}`).join(' • ')}
                        </p>
                      ) : item.variant.sku ? (
                        <p className="text-[10px] text-muted-foreground font-mono truncate">
                          SKU: {item.variant.sku}
                        </p>
                      ) : null}
                    </div>

                    {/* Price & Quantity */}
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-primary">
                        {formatCurrency(item.variant.price)}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        x{item.quantity}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Shopee-style Footer Bar */}
            <div className="p-3 bg-muted/20 border-t border-border/60 flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground truncate">
                {remainingCount > 0 ? (
                  <span>{remainingCount} more products in cart</span>
                ) : (
                  <span>
                    Total: <strong className="text-foreground font-bold">{formatCurrency(totalPrice)}</strong>
                  </span>
                )}
              </div>

              <Link href={ROUTES.SHOP.CART} onClick={() => setOpen(false)}>
                <Button size="sm" className="rounded-xl text-xs font-bold px-3.5 gap-1.5 shadow-xs">
                  <span>View Cart</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
