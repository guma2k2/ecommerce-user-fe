import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/shared/constants';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-muted/30">
      {/* Background Decorative Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -right-40 size-[400px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="flex h-16 items-center justify-between px-6 md:px-12">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-extrabold text-sm">
            E
          </div>
          <span>Storefront</span>
        </Link>
      </header>

      {/* Main Centered Content */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border/30">
        &copy; {new Date().getFullYear()} Storefront eCommerce. All rights reserved.
      </footer>
    </div>
  );
}
