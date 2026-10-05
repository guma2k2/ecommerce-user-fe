'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Avatar, Button } from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores';
import { useSignOut } from '../hooks/useSignOut';

export function UserNav() {
  const { t } = useTranslation('auth');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const user = useAuthStore((state) => state.user);
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isInitializing) {
    return (
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-full bg-muted/60 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link href={ROUTES.AUTH.LOGIN}>
          <Button variant="ghost" size="sm">{t('userNav.signIn')}</Button>
        </Link>
        <Link href={ROUTES.AUTH.REGISTER}>
          <Button size="sm">{t('userNav.register')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        variant="ghost"
        size="unstyled"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted"
        aria-expanded={isOpen}
      >
        <Avatar
          src={user?.avatar}
          alt={user?.name || t('userNav.customer')}
          fallback={user?.name?.[0] || 'U'}
          className="size-8"
        />
        <span className="hidden text-sm font-medium md:inline-block max-w-[120px] truncate">
          {user?.name || t('userNav.customer')}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card p-1 shadow-md z-50 text-sm">
          <div className="px-3 py-2 border-b border-border/50">
            <p className="font-semibold text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>

          <div className="py-1">
            <Link
              href={ROUTES.ACCOUNT.PROFILE}
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center px-3 py-1.5 rounded-sm hover:bg-muted text-foreground transition-colors"
            >
              {t('userNav.profile')}
            </Link>
            <Link
              href={ROUTES.ACCOUNT.ORDERS}
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center px-3 py-1.5 rounded-sm hover:bg-muted text-foreground transition-colors"
            >
              {t('userNav.orders')}
            </Link>
          </div>

          <div className="border-t border-border/50 pt-1">
            <Button
              type="button"
              variant="menuItem"
              size="unstyled"
              disabled={isSigningOut}
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="flex w-full items-center px-3 py-1.5 rounded-sm text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
            >
              {isSigningOut ? t('userNav.loggingOut') : t('userNav.logout')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
