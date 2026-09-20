'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, Button } from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores';
import { useSignOut } from '../hooks/useSignOut';

export function UserNav() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
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

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link href={ROUTES.AUTH.LOGIN}>
          <Button variant="ghost" size="sm">Sign In</Button>
        </Link>
        <Link href={ROUTES.AUTH.REGISTER}>
          <Button size="sm">Register</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar
          src={user?.avatar}
          alt={user?.name || 'Customer'}
          fallback={user?.name?.[0] || 'U'}
          className="size-8"
        />
        <span className="hidden text-sm font-medium md:inline-block max-w-[120px] truncate">
          {user?.name || 'Customer'}
        </span>
      </button>

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
              My Profile
            </Link>
            <Link
              href={ROUTES.ACCOUNT.ORDERS}
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center px-3 py-1.5 rounded-sm hover:bg-muted text-foreground transition-colors"
            >
              Order History
            </Link>
          </div>

          <div className="border-t border-border/50 pt-1">
            <button
              type="button"
              disabled={isSigningOut}
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="flex w-full items-center px-3 py-1.5 rounded-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
