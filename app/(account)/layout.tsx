import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/shared/constants';
import { UserNav } from '@/features/auth';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Account Shell Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-extrabold text-sm">
                E
              </div>
              <span>Storefront</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
                Catalog
              </Link>
              <Link
                href={ROUTES.ACCOUNT.PROFILE}
                className="text-foreground transition-colors"
              >
                Profile
              </Link>
              <Link
                href={ROUTES.ACCOUNT.ORDERS}
                className="hover:text-foreground transition-colors"
              >
                Orders
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-8">
        {children}
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Storefront eCommerce. All rights reserved.
      </footer>
    </div>
  );
}
