'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores';
import { UserNav } from '@/features/auth';
import { SearchBar } from '@/features/search';
import { Button } from '@/components/ui';

interface HeaderProps {
  className?: string;
  cartItemCount?: number;
}

export function Header({ className = '', cartItemCount = 0 }: HeaderProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur-md transition-all duration-200 ${className}`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Brand Logo */}
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight shrink-0 group focus-visible:outline-none"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold text-base shadow-sm group-hover:scale-105 transition-transform duration-200">
            E
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text text-transparent">
            Storefront
          </span>
        </Link>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:block flex-1 max-w-xl mx-4">
          <SearchBar placeholder="Search genuine products, brands, categories..." />
        </div>

        {/* Navigation & User Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Cart Icon Button - Displayed only when logged in */}
          {isAuthenticated && (
            <Link href={ROUTES.SHOP.CART} aria-label="Shopping Cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-muted text-foreground transition-colors"
              >
                <ShoppingCart className="size-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-xs animate-in zoom-in-50">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {/* User Nav: Sign In/Register when logged out, Profile Dropdown when logged in */}
          <UserNav />
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="md:hidden px-4 pb-3 pt-1 border-t border-border/30">
        <SearchBar placeholder="Search products..." />
      </div>
    </header>
  );
}
